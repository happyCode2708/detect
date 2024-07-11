import { writeJsonToFile } from '../json';
import { encodeImageToBase64 } from '../image';
import { mapOcrToPredictDataPoint } from '../validator/mapOcrToPredictDataPoint';
import { makePrompt } from '../promp/all_utils';
import { make_nut_prompt } from '../promp/nut_utils';

import path, { resolve } from 'path';
import fs from 'fs';
import { historyDir, prisma, resultsDir } from '../../server';
// import { makePrompt, make_nut_prompt } from '../constants';
import sharp from 'sharp';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { make_markdown_nut_prompt } from '../promp/markdown_nut_utils';
import { mapMarkdownNutToObject } from '../mapper/mapMarkdonwDataToObject';
import { make_markdown_all_prompt } from '../promp/markdown_all_utils';
import { mapMarkdownAllToObject } from '../mapper/mapMdAllToObject';
import { make_markdown_all_prompt_test } from '../promp/markdown_all_utils_test';
import { make_markdown_all_prompt_test_2 } from '../promp/markdown_all_utils_test_2';

export const generateContent = async (images: any[], text: any) => {
  if (!(global as any)?.generativeModel) return;

  const req = {
    contents: [{ role: 'user', parts: [...images, text] }],
  };

  // try {
  // const streamingResp = await (
  //   global as any
  // ).generativeModel.generateContentStream(req);

  // let chunkResponse = [];

  // let finalResponse = '';

  // for await (const item of streamingResp.stream) {
  //   chunkResponse.push(item);
  //   if (!item?.candidates) return;
  //   finalResponse =
  //     finalResponse + item?.candidates[0]?.content?.parts?.[0]?.text;
  //   if (!item?.candidates[0]?.content?.parts?.[0]?.text) {
  //     console.log(
  //       'chunk error  ...' + item?.candidates[0]?.content?.parts?.[0]?.text
  //     );
  //   }
  // }

  // return { chunkResponse, finalResponse };

  const streamingResp = await (
    global as any
  ).generativeModel.generateContentStream(req);
  let chunkResponse = [] as any;
  let finalResponse = '';

  // Set a timeout for the streaming process
  const timeoutPromise = new Promise(
    (_, reject) =>
      setTimeout(() => reject(new Error('Streaming timeout')), 220000) // 30 seconds timeout
  );

  // Process the stream with error handling and timeout
  await Promise.race([
    (async () => {
      // for await (const item of streamingResp.stream) {
      //   if (!item?.candidates) return;
      //   chunkResponse.push(item);
      //   const textPart = item?.candidates[0]?.content?.parts?.[0]?.text;
      //   if (!textPart) {
      //     console.log('chunk error  ...' + textPart);
      //     continue;
      //   }
      //   finalResponse += textPart;
      // }
      for await (const item of streamingResp.stream) {
        chunkResponse.push(item);
        if (!item?.candidates) return;
        const value = item?.candidates[0]?.content?.parts?.[0]?.text;
        finalResponse = finalResponse + value;
        // console.log(`...`);
        if (item?.candidates[0]?.content?.parts?.[0]?.text === undefined) {
          console.log(
            'chunk error  ...' + item?.candidates[0]?.content?.parts?.[0]?.text
          );
          throw new Error('chunk empty answer');
        }
      }
    })(),
    timeoutPromise,
  ]);

  // return finalResponse;
  return { chunkResponse, finalResponse };
  // } catch (err) {
  //   console.log('chunk error', err);
  // }
};

export const onProcessGemini = async ({
  req,
  res,
  sessionId,
  collateImageName,
  collatedOuputPath,
  prefix = '',
  prompt,
  isMarkdown,
  mapMdToObjectFunct,
  sessionPayload = {},
}: {
  req: any;
  res: any;
  sessionId: string;
  collateImageName: string;
  collatedOuputPath: string[];
  prefix?: string;
  prompt: string;
  isMarkdown?: boolean;
  mapMdToObjectFunct?: any;
  sessionPayload: any;
}) => {
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

  const resultFileName = (prefix ? `${prefix}` : '') + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'prompt-' + resultFileName,
    text1.text
  );

  sessionPayload = {
    ...sessionPayload,
    ['prompt-' + resultFileName]: text1.text,
  };

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

    sessionPayload = {
      ...sessionPayload,
      ['full-' + resultFileName]: JSON.stringify(fullResult),
      ['chunk-' + resultFileName]: JSON.stringify(chunkResponse),
    };

    const procResult = gemini_result?.includes('```json')
      ? gemini_result?.split('```json\n')[1].split('```')[0]
      : gemini_result?.includes('```markdown')
      ? gemini_result?.split('```markdown\n')[1].split('```')[0]
      : gemini_result;

    if (!isMarkdown) {
      const result = JSON.parse(procResult);
      writeJsonToFile(
        resultsDir + `/${sessionId}`,
        resultFileName,
        JSON.stringify({
          isSuccess: true,
          data: result,
        })
      );

      return;
    }

    if (isMarkdown) {
      const jsonResult = mapMdToObjectFunct(procResult);

      writeJsonToFile(
        resultsDir + `/${sessionId}`,
        resultFileName,
        JSON.stringify({
          isSuccess: true,
          data: { jsonData: jsonResult, markdownContent: procResult },
        })
      );

      sessionPayload = {
        ...sessionPayload,
        [resultFileName]: JSON.stringify({
          isSuccess: true,
          data: { jsonData: jsonResult, markdownContent: procResult },
        }),
      };

      return Promise.resolve(sessionPayload);
    }
  } catch (e) {
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: false })
    );

    console.log('on process gemini error or chunk error', e);
    // throw e;

    const updatedSession = await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'fail',
        result_all: JSON.stringify({}),
        result_nut: JSON.stringify({}),
        result: JSON.stringify({}),
      },
    });
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
    const resultFileName = 'all.json';
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: true, data: { product: {} } })
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'all-orc.json',
      JSON.stringify({})
    );

    let sessionPayload = {
      ['all.json']: JSON.stringify({
        isSuccess: true,
        data: {
          jsonData: { isSuccess: true, data: { product: {} } },
          markdownContent: '',
        },
      }),
    };

    return Promise.resolve(sessionPayload);
  }

  const prefix = 'all';

  const resultFileName = (prefix ? `${prefix}` : '') + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    resultFileName,
    JSON.stringify({
      isSuccess: 'unknown',
      status: 'processing',
    })
  );

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

  // const { ocr_claims } = (await mapOcrToPredictDataPoint(new_allText)) || {};

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'all-orc.json',
    JSON.stringify(new_allText)
  );

  let sessionPayload = {
    'all-ocr': JSON.stringify(new_allText),
  };

  const finalSessionPayload = await onProcessGemini({
    req,
    res,
    sessionId,
    collateImageName,
    prefix,
    //* markdown all
    collatedOuputPath: [
      ...invalidatedInput.nutIncluded,
      ...invalidatedInput.nutExcluded,
    ],

    prompt: make_markdown_all_prompt({
      ocrText: JSON.stringify(new_allText),
      imageCount: [
        ...invalidatedInput.nutIncluded,
        ...invalidatedInput.nutExcluded,
      ]?.length,
    }),
    isMarkdown: true,
    mapMdToObjectFunct: mapMarkdownAllToObject,
    sessionPayload,
  });

  return Promise.resolve(finalSessionPayload);
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
  // if (invalidatedInput?.nutIncluded?.length === 0 || !outputConfig.nut) {
  if (!outputConfig.nut) {
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'nut.json',
      JSON.stringify({ isSuccess: true, data: { product: { factPanel: [] } } })
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'nut-orc.json',
      JSON.stringify({})
    );

    let sessionPayload = {
      ['nut.json']: JSON.stringify({
        isSuccess: true,
        data: {
          jsonData: {
            isSuccess: true,
            data: { product: { factPanel: [] } },
          },
          markdownContent: '',
        },
      }),
    };

    return Promise.resolve(sessionPayload);
  }

  const prefix = 'nut';

  const resultFileName = (prefix ? `${prefix}` : '') + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    resultFileName,
    JSON.stringify({
      isSuccess: 'unknown',
      status: 'processing',
    })
  );

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
    'nut-orc.json',
    JSON.stringify(new_nutText)
  );

  let sessionPayload = {
    'nut-ocr': JSON.stringify(new_nutText),
  };

  const finalSessionPayload = await onProcessGemini({
    req,
    res,
    sessionId,
    collateImageName,
    prefix,

    //* markdown nut
    collatedOuputPath: [
      ...invalidatedInput.nutIncluded,
      ...invalidatedInput.nutExcluded,
    ],
    prompt: make_markdown_nut_prompt({
      ocrText: JSON.stringify(new_nutText),
      imageCount: [
        ...invalidatedInput.nutIncluded,
        ...invalidatedInput.nutExcluded,
      ]?.length,
    }),
    isMarkdown: true,
    mapMdToObjectFunct: mapMarkdownNutToObject,
    sessionPayload,
  });

  return Promise.resolve(finalSessionPayload);
};
