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

// import OpenAI from 'openai';

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

    const filePaths = product?.images?.map((imageItem: any) => imageItem?.path);

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

    const [finalNut, finalAll] = await Promise.all([
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
      }),
      onProcessOther({
        req,
        res,
        invalidatedInput,
        ocrList: [...nutImagesOCRresult, ...nutExcludedImagesOCRresult],
        sessionId,
        collateImageName,
        outputConfig,
      }),
    ]);

    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'fail',
        result_all: JSON.stringify({}),
        result_nut: JSON.stringify({}),
      },
    });
    await createFinalResult({ finalAll, finalNut, sessionId, res });
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
          result_all: JSON.stringify({}),
          result_nut: JSON.stringify({}),
          result: JSON.stringify({}),
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
    const { result_all, result_nut, sessionId } = latestExtractSession;

    if (!result_all || !result_nut) {
      return res.status(404).json({ error: 'Product not valid to revalidate' });
    }
    const finalAll = JSON.parse(result_all);
    const finalNut = JSON.parse(result_nut);

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
  // try {
  const allRes = JSON.parse(finalAll?.['all.json']);
  const nutRes = JSON.parse(finalNut?.['nut.json']);
  // const ocrClaims = JSON.parse(ocrClaimData);

  const { isSuccess: allSuccess, status: allStatus } = allRes || {};
  const { isSuccess: nutSuccess, status: nutStatus } = nutRes || {};

  if (nutSuccess === false || allSuccess === false) {
    return;
  }

  let finalResult = {
    product: {
      ...allRes?.data?.jsonData,
      factPanels: nutRes?.data?.jsonData, //* markdown converted
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
  // } catch (err) {
  //   const updatedSession = await prisma.extractSession.update({
  //     where: { sessionId },
  //     data: {
  //       status: 'fail',
  //       result_all: JSON.stringify({}),
  //       result_nut: JSON.stringify({}),
  //       result: JSON.stringify({}),
  //     },
  //   });
  // }
};

// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   if (!req.file?.path) return res.json({ isSuccess: false, message: 'failed' });
//   const file = req.file;
//   const otherParams = req.body;
//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     const maxTokens = 4000;
//     const base64Image = encodeImageToBase64(req.file.path);
//     const imagePath = `data:image/jpeg;base64,${base64Image}`;
//     const resultFileName = req.file.filename + '.json';

//     console.log('resultFileName: ', resultFileName);

//     res.json({ resultFileName, image: imagePath });

//     const response = await openai.chat.completions.create({
//       model: 'gpt-4-turbo',
//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'text',
//               text: `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects. Each object should contain:
//               json
//               [
//                {
//                "panelName": string ,
//                "amountPerServing": {"value": float?, "uom": string},
//                "servingSize": {"value": string, "uom": string},
//                "servingPerContainer": {"value": float?, "uom": string},
//                "nutrients": [{"name": string, "value": float?, "uom": string, "percentDailyValue": float}],
//                "note": string,
//                "ingredients": string
//                }
//               ]

//               Some rules for you:

//               1) Extract exact numbers provided. No calculations or approximations are permitted.

//               2) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

//               3) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

//               4) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).

//               5) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').

//               6) Special characters like *, +, ., before the note section are crucial - they usually have specific implications.

//               7) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.

//               8) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.

//               9) Ingredients usually appear below or next to the nutrition panel and start with "ingredients:".

//               10) The fact info could be put side by side and may need to be extract data just like we are reading a table

//               11) The fact panel has two or more than two different nutrition info for two different sizes of serving. Please read the image carefully to check how many sizes of serving on the the fact panel

//               12) Please only return the json in the response
//               `,
//             },
//             {
//               type: 'image_url',
//               image_url: { url: imagePath },
//             },
//           ],
//         },
//       ],
//       temperature: 1,
//       max_tokens: maxTokens,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });

//     const result = response.choices[0]?.message?.content;

//     if (!result) return;
//     const proc_result = result.split('```json\n')[1].split('```')[0];

//     writeJsonToFile(resultsDir, resultFileName, JSON.stringify(proc_result));

//     console.log('response', response.choices[0].message);
//     res.json({ result, image: imagePath });
//   } catch (error) {
//     console.error('Error calling OpenAI API:', error);
//     res.status(500).send('Failed to generate text');
//   }
// });

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
