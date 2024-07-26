import { Request, Response } from 'express';

import {
  getOcrTextAllImages,
  findImagesContainNutFact,
  addUniqueString,
} from '../../../lib/server_utils';

import { onProcessNut, onProcessOther } from '../../../lib/google/gemini';

import { prisma } from '../../../server';
import { checkFilesExist, getFilename } from '../../../lib/utils/checkFile';

import { findUpcFromImages } from '../../../lib/utils/findUpc';

export const processProductImage = async (req: Request, res: Response) => {
  let responseReturned = false;
  let sessionId;
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.body.productId },
      include: { images: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const filePaths = product?.images?.map((imageItem: any) => {
      const fileName = getFilename(imageItem?.path);

      console.log('filename', fileName);

      if (process.env.SOURCE === 'home') {
        return `/Users/duynguyen/Desktop/foodocr/foodocr/assets/upload/${fileName}`;
      }

      if (process.env.SOURCE === 'company') {
        return 'C:/Users/nnqduy/Desktop/ocr/detect/assets/upload/' + fileName;
      }

      return imageItem?.path;
    });

    try {
      const checkFileExistResults = await checkFilesExist(filePaths);
      const fileExistList = checkFileExistResults.filter(
        (item: any) => item?.exists === true
      );

      if (fileExistList?.length < filePaths?.length) {
        res
          .status(404)
          .json({ isSuccess: false, message: 'not enough file path' });

        return;
      }
    } catch (err) {
      res.status(404).json({
        isSuccess: false,
        message: 'some thing went wrong when checking for image files',
      });
    }

    const newSession = await prisma.extractSession.create({
      data: {
        productId: product.id,
        status: 'unknown',
      },
    });

    sessionId = newSession.sessionId;

    const biasForm = JSON.parse(req.body?.biasForm);
    const outputConfig = JSON.parse(req.body?.outputConfig);

    const collateImageName = `${sessionId}.jpeg`;

    console.log('run on model ', (global as any).generativeModelName);

    console.log('filePath', JSON.stringify(filePaths));

    let invalidatedInput = await findImagesContainNutFact(filePaths);
    let foundUpc12 = await findUpcFromImages(filePaths);

    console.log('upc', foundUpc12);

    Object.entries(biasForm).forEach(([key, value]: any) => {
      if (value?.haveNutFact === true) {
        let newNutIncluded = addUniqueString(
          invalidatedInput.nutIncluded,
          filePaths[key]
        );

        invalidatedInput.nutIncluded = newNutIncluded;
      }
    });

    console.log('result', JSON.stringify(invalidatedInput));

    const nutImagesOCRresult = await getOcrTextAllImages(
      invalidatedInput.nutIncluded
    );

    const nutExcludedImagesOCRresult = await getOcrTextAllImages(
      invalidatedInput.nutExcluded
    );

    res.json({
      sessionId,
      images: [],
      nutIncludedIdx: invalidatedInput?.nutIncludedIdx,
      messages: [
        invalidatedInput.nutIncluded?.length === 0
          ? 'There is no nut/supp facts panel detected by nut/supp fact panel detector module. If nut/supp fact panels are on provided image. Please set up bias of nut/supp for image to extract info. (Nutrition and Supplement Panel detector is on development state)'
          : null,
      ],
    });

    responseReturned = true;

    // const [finalNut, finalAll] = await Promise.all([
    onProcessNut({
      req,
      res,
      invalidatedInput,
      //* flash version
      ocrList: [...nutImagesOCRresult, ...nutExcludedImagesOCRresult],
      // ocrList: nutImagesOCRresult,
      sessionId,
      collateImageName,
      outputConfig,
    });
    onProcessOther({
      req,
      res,
      invalidatedInput,
      ocrList: [...nutImagesOCRresult, ...nutExcludedImagesOCRresult],
      sessionId,
      collateImageName,
      outputConfig,
      extraInfo: {
        physical: {
          upc12: foundUpc12,
        },
      },
      // config: { flash: true },
    });
    // ]);

    // await prisma.extractSession.update({
    //   where: { sessionId },
    //   data: {
    //     status: 'fail',
    //     result_all: JSON.stringify({}),
    //     result_nut: JSON.stringify({}),
    //   },
    // });
    //* await createFinalResult({ finalAll, finalNut, sessionId, res });
  } catch (e) {
    console.log('process-image-error', e);

    if (!responseReturned) {
      res.status(500).json({
        isSuccess: false,
        error: JSON.stringify(e),
        message: 'Failed to create session',
      });
    } else {
      await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: 'fail',
          result_all: null,
          result_nut: null,
          result: null,
        },
      });
    }
  }
};
