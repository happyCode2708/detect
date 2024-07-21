import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import express from 'express';

import {
  getOcrTextAllImages,
  findImagesContainNutFact,
  addUniqueString,
  removeRawFieldData,
} from '../../lib/server_utils';

import { onProcessNut, onProcessOther } from '../../lib/google/gemini';

import { uploadsDir, resultsDir, baseDir } from '../../server';
import { writeJsonToFile } from '../../lib/json';

import { prisma } from '../../server';
import { responseValidator } from '../../lib/validator/main';
import { checkFilesExist } from '../../lib/utils/checkFile';
import { mapMarkdownAllToObject } from '../../lib/mapper/mapMdAllToObject';
import { mapMarkdownNutToObject } from '../../lib/mapper/mapMarkdonwDataToObject';

import OpenAI from 'openai';
import { encodeImageToBase64 } from '../../lib/image';
import { ChatCompletionContentPartImage } from 'openai/resources/chat/completions';
import { make_gpt4_o_prompt } from '../../lib/promp/gpt4-o-mini';
import { findUpcFromImages } from '../../lib/utils/findUpc';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const router = express.Router();

const Storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // Check if the directory exists, create it if not
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Directory created: c p${uploadsDir}`);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // @ts-ignore
    const sessionId = req?.customData?.sessionId ?? '';

    const uniqueSuffix = Date.now();
    cb(
      null,
      (sessionId ? `${sessionId}` : '') +
        '__' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: Storage });

router.post(
  '/process-image',
  async (req, res, next) => {
    const sessionId = uuidv4();

    // @ts-ignore
    req.customData = { sessionId };
    next();
  },
  upload.array('file'),
  async (req, res) => {
    // @ts-ignore
    const sessionId = req?.customData?.sessionId;

    const files = req.files as Express.Multer.File[];

    const filePaths = files?.map((file: any) => file.path);

    const fileLists = files?.map((file: any) => {
      return {
        name: file?.filename,
        path: file?.path,
      };
    });

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'images-list.json',
      JSON.stringify(fileLists)
    );

    const collateImageName = `${sessionId}.jpeg`;
    // const collatedOuputPath = path.join(uploadsDir, collateImageName);
    // const mergeImageFilePath = path.join(pythonPath, 'merge_image.py');

    console.log('run on model ', (global as any).generativeModelName);

    console.log('filePath', JSON.stringify(filePaths));

    const biasForm = JSON.parse(req.body?.biasForm);
    const outputConfig = JSON.parse(req.body?.outputConfig);

    let invalidatedInput = await findImagesContainNutFact(filePaths);

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
    });
  }
);

const getFilename = (filePath: any) => {
  const match = filePath.match(/[^\\\/]+$/);
  return match ? match[0] : null;
};

router.post('/process-product-image', async (req, res) => {
  let responseReturned = false;
  let sessionId;
  try {
    const product = await prisma.product.findUnique({
      where: { ixoneID: req.body.ixoneId },
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

    // await createCollage(filePaths, collatedOuputPath);

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
});

router.post('/revalidate-product-data', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { ixoneID: req.body.ixoneId },
      include: { images: true, extractSessions: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.extractSessions.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const latestExtractSession = product.extractSessions?.[0];
    const {
      result_all: result_all_raw,
      result_nut: result_nut_raw,
      sessionId,
    } = latestExtractSession;

    if (!result_all_raw || !result_nut_raw) {
      return res.status(404).json({ error: 'Product not valid to revalidate' });
    }
    const finalAll = JSON.parse(result_all_raw);
    const finalNut = JSON.parse(result_nut_raw);

    await createFinalResult({ finalAll, finalNut, sessionId, res });

    res.status(200).json({
      isSuccess: true,
      message: 'revalidate success fully',
      data: { sessionId },
    });
  } catch (error) {
    console.log('error', error);
    res.status(404).json({
      isSuccess: false,
      error: JSON.stringify(error),
      message: 'Failed to revalidate product',
    });
  }
});

const createFinalResult = async ({
  finalNut,
  finalAll,
  sessionId,
  res,
}: {
  finalNut: any;
  finalAll: any;
  sessionId: string;
  res: any;
}) => {
  try {
    const allRes = JSON.parse(finalAll?.['all.json']);
    const nutRes = JSON.parse(finalNut?.['nut.json']);
    // const ocrClaims = JSON.parse(ocrClaimData);

    const {
      isSuccess: allSuccess,
      status: allStatus,
      data: allResData,
    } = allRes || {};
    const {
      isSuccess: nutSuccess,
      status: nutStatus,
      data: nutResData,
    } = nutRes || {};

    if (nutSuccess === false || allSuccess === false) {
      return;
    }

    //* if both process success
    const allJsonData = mapMarkdownAllToObject(
      allResData?.markdownContent,
      allResData?.extraInfo
    );
    const nutJsonData = mapMarkdownNutToObject(nutResData?.markdownContent);

    let finalResult = {
      product: {
        // ...allRes?.data?.jsonData,
        ...allJsonData,
        // factPanels: nutRes?.data?.jsonData, //* markdown converted
        factPanels: nutJsonData,
        nutMark: nutRes?.data?.markdownContent,
        allMark: allRes?.data?.markdownContent,
      },
    };

    let validatedResponse = await responseValidator(finalResult, '');

    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'success',
        result_all: JSON.stringify(finalAll),
        result_nut: JSON.stringify(finalNut),
        result: JSON.stringify(validatedResponse),
      },
    });

    console.log('stored in ' + sessionId);
  } catch (err) {
    const updatedSession = await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'fail',
        result_all: null,
        result_nut: null,
        result: null,
      },
    });
  }
};

router.post('/gpt-test', upload.single('file'), async (req, res) => {
  let responseReturned = false;
  let sessionId;
  try {
    const product = await prisma.product.findUnique({
      where: { ixoneID: req.body.ixoneId },
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

    const images = filePaths.map((path) => {
      const base64Image = encodeImageToBase64(path);
      // return {
      //   inlineData: {
      //     mimeType: 'image/png',
      //     data: base64Image,
      //   },
      // };
      return `data:image/jpeg;base64,${base64Image}`;
    });

    const imagesPromptList: ChatCompletionContentPartImage[] = images?.map(
      (imagePath) => {
        return {
          type: 'image_url',
          image_url: { url: imagePath },
        };
      }
    );

    const maxTokens = 8000;

    // const imagePath = `data:image/jpeg;base64,${base64Image}`;

    const response = await (global as any)?.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: make_gpt4_o_prompt(),
            },
            // ...imagesPromptList,
            // {
            //   type: 'image_url',
            //   image_url: { url: imagePath },
            // },
          ],
        },
      ],
      temperature: 1,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log('response', JSON.stringify(response));

    const result = response.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Failed to generate text');
  }

  // if (!result) return;
  // const proc_result = result.split('```json\n')[1].split('```')[0];

  // writeJsonToFile(resultsDir, resultFileName, JSON.stringify(proc_result));

  // console.log('response', response.choices[0].message);
  // res.json({ result, image: imagePath });
});

// const onProcessNut = async ({
//   req,
//   res,
//   invalidatedInput,
//   ocrList,
//   sessionId,
//   collateImageName,
//   outputConfig,
// }: {
//   req: any;
//   res: any;
//   invalidatedInput: any;
//   ocrList: any[];
//   sessionId: string;
//   collateImageName: string;
//   outputConfig: any;
// }) => {
//   if (invalidatedInput?.nutIncluded?.length === 0 || !outputConfig.nut) {
//     const resultFileName = 'nut-' + sessionId + '.json';

//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       resultFileName,
//       JSON.stringify({ isSuccess: true, data: { product: { factPanel: [] } } })
//     );

//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'nut-orc-' + sessionId + '.json',
//       JSON.stringify({})
//     );

//     return;
//   }

//   const prefix = 'nut';

//   const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

//   writeJsonToFile(
//     resultsDir + `/${sessionId}`,
//     resultFileName,
//     JSON.stringify({
//       isSuccess: 'unknown',
//       status: 'processing',
//     })
//   );

//   const nutText = ocrList.reduce(
//     (accumulator: any, currentValue: any, idx: number) => {
//       return {
//         ...accumulator,
//         [`ocrImage_${idx + 1}`]: currentValue,
//       };
//     },
//     {}
//   );

//   writeJsonToFile(
//     resultsDir + `/${sessionId}`,
//     'nut-orc-' + sessionId + '.json',
//     JSON.stringify(nutText)
//   );

//   onProcessGemini({
//     req,
//     res,
//     sessionId,
//     collateImageName,
//     collatedOuputPath: invalidatedInput.nutIncluded,
//     prompt: make_nut_prompt({
//       ocrText: JSON.stringify(nutText),
//       imageCount: invalidatedInput.nutIncluded?.length,
//     }),
//     prefix,
//   });
// };

// const onProcessOther = async ({
//   req,
//   res,
//   invalidatedInput,
//   ocrList,
//   sessionId,
//   collateImageName,
//   outputConfig,
// }: {
//   req: any;
//   res: any;
//   invalidatedInput: any;
//   ocrList: any[];
//   sessionId: string;
//   collateImageName: string;
//   outputConfig: any;
// }) => {
//   if (!outputConfig.other) {
//     const resultFileName = 'all-' + sessionId + '.json';
//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       resultFileName,
//       JSON.stringify({ isSuccess: true, data: { product: {} } })
//     );

//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'all-orc-' + sessionId + '.json',
//       JSON.stringify({})
//     );

//     return;
//   }

//   const prefix = 'all';

//   const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

//   writeJsonToFile(
//     resultsDir + `/${sessionId}`,
//     resultFileName,
//     JSON.stringify({
//       isSuccess: 'unknown',
//       status: 'processing',
//     })
//   );

//   const allText = ocrList.reduce(
//     (accumulator: any, currentValue: any, idx: number) => {
//       return {
//         ...accumulator,
//         [`ocrImage_${idx + 1}`]: currentValue,
//       };
//     },
//     {}
//   );

//   const { ocr_claims } = (await mapOcrToPredictDataPoint(allText)) || {};

//   writeJsonToFile(
//     resultsDir + `/${sessionId}`,
//     'all-orc-' + sessionId + '.json',
//     JSON.stringify(allText)
//   );

//   onProcessGemini({
//     req,
//     res,
//     sessionId,
//     collateImageName,
//     collatedOuputPath: [
//       ...invalidatedInput.nutIncluded,
//       ...invalidatedInput.nutExcluded,
//     ],
//     prompt: makePrompt({
//       ocrText: JSON.stringify(allText),
//       imageCount: [
//         ...invalidatedInput.nutIncluded,
//         ...invalidatedInput.nutExcluded,
//       ]?.length,
//       detectedClaims: JSON.stringify(ocr_claims),
//     }),
//     prefix,
//   });
// };

export default router;
