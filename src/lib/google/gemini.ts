import { writeJsonToFile } from '../json';
import { encodeImageToBase64 } from '../image';
import { mapOcrToPredictDataPoint } from '../validator/mapOcrToPredictDataPoint';
import { makePrompt } from '../promp/all_utils';
import { make_nut_prompt } from '../promp/nut_utils';

import path, { resolve } from 'path';
import fs from 'fs';
import { historyDir, resultsDir } from '../../server';
// import { makePrompt, make_nut_prompt } from '../constants';
import sharp from 'sharp';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export const generateContent = async (images: any[], text: any) => {
  if (!(global as any)?.generativeModel) return;

  const req = {
    contents: [{ role: 'user', parts: [...images, text] }],
  };

  const streamingResp = await (
    global as any
  ).generativeModel.generateContentStream(req);

  let chunkResponse = [];

  let finalResponse = '';

  for await (const item of streamingResp.stream) {
    chunkResponse.push(item);
    if (!item?.candidates) return;
    finalResponse =
      finalResponse + item?.candidates[0]?.content?.parts?.[0]?.text;
  }

  return { chunkResponse, finalResponse };
};

export const onProcessGemini = async ({
  req,
  res,
  sessionId,
  collateImageName,
  collatedOuputPath,
  prefix = '',
  prompt,
}: {
  req: any;
  res: any;
  sessionId: string;
  collateImageName: string;
  collatedOuputPath: string[];
  prefix?: string;
  prompt: string;
}) => {
  // const base64Image = encodeImageToBase64(collatedOuputPath);

  // const base64Full = `data:image/jpeg;base64,${base64Image}`;
  // const image1 = {
  //   inlineData: {
  //     mimeType: 'image/png',
  //     data: base64Image,
  //   },
  // };
  const images = collatedOuputPath.map((path) => {
    const base64Image = encodeImageToBase64(path);
    return {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    };
  });

  const text1 = {
    text: prompt,
  };

  const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

  // addNewExtractionToHistory(sessionId, {
  //   collateImage: { name: collateImageName, url: collatedOuputPath },
  //   inputFilePaths: collatedOuputPath,
  //   result: {
  //     name: resultFileName,
  //     url: path.join(resultsDir, resultFileName),
  //   },
  // });

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'prompt-' + resultFileName,
    text1.text
  );

  try {
    const { chunkResponse, finalResponse: gemini_result } =
      (await generateContent(images, text1)) || {};

    if (!gemini_result) return;
    //! try to parse
    const fullResult = gemini_result;
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'full-' + resultFileName,
      JSON.stringify(fullResult)
    );
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'chunk-' + resultFileName,
      JSON.stringify(chunkResponse)
    );

    const procResult = gemini_result?.includes('```json')
      ? gemini_result?.split('```json\n')[1].split('```')[0]
      : gemini_result;

    const result = JSON.parse(procResult);
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({
        isSuccess: true,
        data: result,
      })
    );
  } catch (e) {
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: false })
    );

    console.log('some thing went wrong', e);
  }
};

export const onProcessOther = async ({
  req,
  res,
  invalidatedInput,
  ocrList,
  sessionId,
  collateImageName,
  outputConfig,
}: {
  req: any;
  res: any;
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  collateImageName: string;
  outputConfig: any;
}) => {
  if (!outputConfig.other) {
    const resultFileName = 'all-' + sessionId + '.json';
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: true, data: { product: {} } })
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'all-orc-' + sessionId + '.json',
      JSON.stringify({})
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'orc-claims' + sessionId + '.json',
      JSON.stringify({})
    );

    return;
  }

  const prefix = 'all';

  const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    resultFileName,
    JSON.stringify({
      isSuccess: 'unknown',
      status: 'processing',
    })
  );

  // const allText = ocrList.reduce(
  //   (accumulator: any, currentValue: any, idx: number) => {
  //     return {
  //       ...accumulator,
  //       [`ocrImage_${idx + 1}`]: currentValue,
  //     };
  //   },
  //   {}
  // );

  const new_allText = ocrList.reduce(
    (accumulator: any, currentValue: any, idx: number) => {
      let [whole_text, ...array_string] = currentValue;
      let processed_whole_text = array_string.join(' ');
      return {
        ...accumulator,
        [`ocrImage_${idx + 1}`]: processed_whole_text,
      };
    },
    {}
  );

  const { ocr_claims } = (await mapOcrToPredictDataPoint(new_allText)) || {};

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'all-orc-' + sessionId + '.json',
    JSON.stringify(new_allText)
  );

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'orc-claims' + sessionId + '.json',
    JSON.stringify(ocr_claims)
  );

  onProcessGemini({
    req,
    res,
    sessionId,
    collateImageName,
    collatedOuputPath: [
      ...invalidatedInput.nutIncluded,
      ...invalidatedInput.nutExcluded,
    ],
    prompt: makePrompt({
      ocrText: JSON.stringify(new_allText),
      imageCount: [
        ...invalidatedInput.nutIncluded,
        ...invalidatedInput.nutExcluded,
      ]?.length,
      detectedClaims: JSON.stringify(ocr_claims),
    }),
    prefix,
  });
};

export const onProcessNut = async ({
  req,
  res,
  invalidatedInput,
  ocrList,
  sessionId,
  collateImageName,
  outputConfig,
}: {
  req: any;
  res: any;
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  collateImageName: string;
  outputConfig: any;
}) => {
  if (invalidatedInput?.nutIncluded?.length === 0 || !outputConfig.nut) {
    const resultFileName = 'nut-' + sessionId + '.json';

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: true, data: { product: { factPanel: [] } } })
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'nut-orc-' + sessionId + '.json',
      JSON.stringify({})
    );

    return;
  }

  const prefix = 'nut';

  const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    resultFileName,
    JSON.stringify({
      isSuccess: 'unknown',
      status: 'processing',
    })
  );

  // const nutText = ocrList.reduce(
  //   (accumulator: any, currentValue: any, idx: number) => {
  //     return {
  //       ...accumulator,
  //       [`ocrImage_${idx + 1}`]: currentValue,
  //     };
  //   },
  //   {}
  // );

  const new_nutText = ocrList.reduce(
    (accumulator: any, currentValue: any, idx: number) => {
      let [whole_text, ...array_string] = currentValue;
      let processed_whole_text = array_string.join(' ');
      return {
        ...accumulator,
        [`ocrImage_${idx + 1}`]: processed_whole_text,
      };
    },
    {}
  );

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'nut-orc-' + sessionId + '.json',
    JSON.stringify(new_nutText)
  );

  onProcessGemini({
    req,
    res,
    sessionId,
    collateImageName,
    collatedOuputPath: invalidatedInput.nutIncluded,
    prompt: make_nut_prompt({
      ocrText: JSON.stringify(new_nutText),
      imageCount: invalidatedInput.nutIncluded?.length,
    }),
    prefix,
  });
};
