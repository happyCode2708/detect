import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import express from 'express';
import {
  encodeImageToBase64,
  addNewExtractionToHistory,
  writeJsonToFile,
  generateContent,
  createCollage,
} from '../../utils';
import { uploadsDir, resultsDir, pythonPath } from '../../server';
import { NEW_PROMPT, ORIGINAL_PROMPT } from './constants';

const router = express.Router();

const Storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // Check if the directory exists, create it if not
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Directory created: ${uploadsDir}`);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // @ts-ignore
    const sessionId = req?.customData?.sessionId ?? '';

    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname +
        '_' +
        uniqueSuffix +
        (sessionId ? `_${sessionId}` : '') +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: Storage });

router.post(
  '/gemini',
  (req, res, next) => {
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

    const file_paths = files?.map((file: any) => file.path);

    const collateImageName = `${sessionId}.jpeg`;

    const collatedOuputPath = path.join(uploadsDir, collateImageName);
    const mergeImageFilePath = path.join(pythonPath, 'merge_image.py');

    //? collate images
    await createCollage(file_paths, collatedOuputPath);

    onProcessGemini(req, res, sessionId, collateImageName, collatedOuputPath);
  }
);

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

export default router;

const onProcessGemini = async (
  req: any,
  res: any,
  sessionId: string,
  collateImageName: string,
  imagePath: string
) => {
  // const base64Image = encodeImageToBase64(req.file.path);
  const base64Image = encodeImageToBase64(imagePath);

  const base64Full = `data:image/jpeg;base64,${base64Image}`;
  const image1 = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image,
    },
  };
  const text1 = {
    text: NEW_PROMPT,
  };

  const resultFileName = sessionId + '.json';

  addNewExtractionToHistory(sessionId, {
    images: [{ name: collateImageName, url: imagePath }],
    result: {
      name: resultFileName,
      url: path.join(resultsDir, resultFileName),
    },
  });

  res.json({ resultFileName, images: [base64Full] });

  console.log('resultFileName: ', resultFileName);

  const gemini_result = await generateContent(image1, text1);

  if (!gemini_result) return;
  const procResult = gemini_result.split('```json\n')[1].split('```')[0];

  writeJsonToFile(resultsDir, resultFileName, JSON.stringify(procResult));
};
