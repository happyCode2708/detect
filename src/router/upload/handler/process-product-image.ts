import { NextFunction, Request, Response } from 'express';

import { findImagesContainNutFact } from '@/lib/yolo';
import { addUniqueStringToArrayString } from '@/lib/utils/array';
import { getOcrTextAllImages } from '@/lib/ocr';

import { onProcessNut, onProcessAttribute } from '@/lib/google/gemini';
import { make_markdown_attr_1_prompt } from '@/lib/promp/markdown_attr_1_utils';
import { make_markdown_attr_2_prompt } from '@/lib/promp/markdown_attr_2_utils';

import { prisma, uploadsDir } from '@/server';
import { checkFilesExist } from '@/lib/utils/checkFile';

import { findUpcFromImages } from '@/lib/utils/findUpc';
import { Status } from '@prisma/client';
import path from 'path';

export const processProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let sessionIdReturned = false;
  let sessionId;

  try {
    const product = await prisma.product.findUnique({
      where: { id: req.body.productId },
      include: { images: true },
    });

    //* product not found
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    //* get image path
    const filePaths = product?.images?.map((imageItem: any) => {
      const imageFilePath = imageItem?.path;
      return path.join(uploadsDir, '..', imageFilePath);
    });

    //* checking image files
    try {
      const checkFileExistResults = await checkFilesExist(filePaths);

      const notEnoughFile = checkFileExistResults?.some(
        (item) => item?.exists === false
      );

      if (notEnoughFile) {
        throw new Error('not enough file path');
      }
    } catch (err) {
      throw new Error('some thing went wrong when checking for image files');
    }

    const biasForm = JSON.parse(req.body?.biasForm);
    const outputConfig = JSON.parse(req.body?.outputConfig);

    let invalidatedInput = await findImagesContainNutFact(filePaths);

    let foundUpc12 = await findUpcFromImages(filePaths);

    // Object.entries(biasForm).forEach(([key, value]: any) => {
    //   if (value?.haveNutFact === true) {
    //     let newNutIncluded = addUniqueStringToArrayString(
    //       invalidatedInput.nutIncluded,
    //       filePaths[key]
    //     );
    //     invalidatedInput.nutIncluded = newNutIncluded;
    //   }
    // });

    // const nutImagesOCRresult = await getOcrTextAllImages(
    //   invalidatedInput.nutIncluded
    // );

    // const nutExcludedImagesOCRresult = await getOcrTextAllImages(
    //   invalidatedInput.nutExcluded
    // );

    const orcAllImages = await getOcrTextAllImages(filePaths);

    const mappedOcr = orcAllImages?.map((ocrTextOfImage, idx: number) => {
      return {
        imageId: product?.images?.[idx]?.id,
        ocr: ocrTextOfImage,
      };
    });

    // * create new session with status unknown
    const newSession = await prisma.extractSession.create({
      data: {
        productId: product.id,
        status: Status.UNKNOWN,
        ocr: JSON.stringify(mappedOcr),
      },
    });

    sessionId = newSession.sessionId;

    //* return the response to client for pooling result
    res.json({
      sessionId,
      images: [],
      nutIncludedIdx: invalidatedInput?.nutIncludedIdx,
    });

    sessionIdReturned = true;

    onProcessNut({
      invalidatedInput,
      ocrList: orcAllImages,
      sessionId,
      outputConfig,
      config: {
        region: 1,
        // gpt: true,
      },
      prefix: 'nutrition',
    });

    onProcessAttribute({
      invalidatedInput,
      ocrList: orcAllImages,
      sessionId,
      outputConfig,
      extraInfo: {
        physical: {
          upc12: foundUpc12,
        },
      },
      prefix: 'attr_1',
      promptMakerFn: make_markdown_attr_1_prompt,
      config: {
        // gpt: true,
        flash: true,
        // stream: true,
      },
    });

    onProcessAttribute({
      invalidatedInput,
      ocrList: orcAllImages,
      sessionId,
      outputConfig,
      extraInfo: {
        physical: {
          upc12: foundUpc12,
        },
      },
      prefix: 'attr_2',
      promptMakerFn: make_markdown_attr_2_prompt,
      config: {
        // gpt: true,
        region: 1,
      },
    });
  } catch (e) {
    if (!sessionIdReturned) {
      next(e);
    } else {
      //* make session failed to stop pooling on client side
      await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: Status.FAIL,
        },
      });
    }
  }
};
