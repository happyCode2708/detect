import { writeJsonToFile } from '../json';
import { encodeImageToBase64 } from '../image';
import { mapOcrToPredictDataPoint } from '../validator/mapOcrToPredictDataPoint';
// import { makePrompt } from '../promp/all_utils';
// import { make_nut_prompt } from '../promp/nut_utils';

import path, { resolve } from 'path';
import fs from 'fs';
import { historyDir, prisma, resultsDir } from '../../server';
// import { makePrompt, make_nut_prompt } from '../constants';
import sharp from 'sharp';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { make_markdown_nut_prompt } from '../promp/markdown_nut_utils';
import { mapMarkdownNutToObject } from '../mapper/mapMarkdonwDataToObject';
import { make_markdown_attr_1_prompt } from '../promp/markdown_attr_1_utils';
import { mapMarkdownAllToObject } from '../mapper/mapMdAllToObject';
// import { make_markdown_all_prompt_test } from '../promp/markdown_all_utils_test';
// import { make_markdown_all_prompt_test_2 } from '../promp/markdown_all_utils_test_2';
import { make_gpt4_o_prompt } from '../promp/gpt4-o-mini';
import { ChatCompletionContentPartImage } from 'openai/resources';

export const generateContent = async (
  imagesPath: any[],
  text: any,
  config?: { flash: boolean; region?: number },
  modelName?: string
) => {
  let chunkResponse = [] as any;
  let finalResponse = '';

  //* gemini
  if (modelName === 'gemini') {
    const images = imagesPath.map((path) => {
      const base64Image = encodeImageToBase64(path);
      return {
        inlineData: {
          mimeType: 'image/png',
          data: base64Image,
        },
      };
    });

    const geminiText = {
      text,
    };

    console.log('FLASH ----', config?.flash);
    const model =
      config?.flash === true
        ? (global as any)?.generativeFlashModel?.[
            `region_${config?.region || 1}`
          ]
        : (global as any)?.generativeModel;

    if (!model) return;

    const req = {
      contents: [{ role: 'user', parts: [...images, geminiText] }],
    };

    const streamingResp = await model.generateContent(req);

    chunkResponse = streamingResp;
    finalResponse =
      streamingResp?.response?.candidates[0]?.content?.parts?.[0]?.text || '';

    return { chunkResponse, finalResponse };
  }

  //* gpt
  if (modelName === 'gpt') {
    const model =
      config?.flash === true
        ? (global as any)?.generativeFlashModel?.[
            `region_${config?.region || 1}`
          ]
        : (global as any)?.generativeModel;

    if (!model) return;

    // const req = {
    //   contents: [{ role: 'user', parts: [...images, text] }],
    // };

    const images: ChatCompletionContentPartImage[] = imagesPath.map((path) => {
      const base64Image = encodeImageToBase64(path);
      // return {
      //   inlineData: {
      //     mimeType: 'image/png',
      //     data: base64Image,
      //   },
      // };
      const imagePath = `data:image/jpeg;base64,${base64Image}`;

      return {
        type: 'image_url',
        image_url: { url: imagePath },
      };
    });

    const maxTokens = 8300;

    const req = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: make_gpt4_o_prompt(),
            },
            ...images,
          ],
        },
      ],
      temperature: 1,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    const streamingResp = await (global as any)?.openai.chat.completions.create(
      req
    );

    console.log('result', JSON.stringify(streamingResp));

    chunkResponse = streamingResp;
    finalResponse = streamingResp.choices[0]?.message?.content || '';

    return { chunkResponse, finalResponse };
  }
};

export const onProcessImage = async ({
  req,
  res,
  sessionId,
  collateImageName,
  collatedOuputPath,
  prefix = '',
  prompt,
  isMarkdown,
  sessionPayload = {},
  extraInfo,
  config,
}: {
  req: any;
  res: any;
  sessionId: string;
  collateImageName: string;
  collatedOuputPath: string[];
  prefix?: string;
  prompt: string;
  isMarkdown?: boolean;
  sessionPayload: any;
  extraInfo?: any;
  config?: { flash: boolean };
}) => {
  const imagesPath = collatedOuputPath;

  const resultFileName = (prefix ? `${prefix}` : '') + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'prompt-' + resultFileName,
    prompt
  );

  sessionPayload = {
    ...sessionPayload,
    ['prompt-' + resultFileName]: prompt,
  };

  try {
    const { chunkResponse, finalResponse: gemini_result } =
      (await generateContent(imagesPath, prompt, config, 'gemini')) || {};

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

    // const procResult = gemini_result?.includes('```json')
    //   ? gemini_result?.split('```json\n')[1].split('```')[0]
    //   : gemini_result?.includes('```markdown')
    //   ? gemini_result?.split('```markdown\n')[1].split('```')[0]
    //   : gemini_result;
    const procResult = gemini_result;

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
      //? important
      //* const jsonResult = mapMdToObjectFunct(procResult);

      writeJsonToFile(
        resultsDir + `/${sessionId}`,
        resultFileName,
        JSON.stringify({
          isSuccess: true,
          data: {
            // ** jsonData: jsonResult,
            markdownContent: procResult,
          },
        })
      );

      sessionPayload = {
        ...sessionPayload,
        [resultFileName]: JSON.stringify({
          isSuccess: true,
          data: {
            //* jsonData: jsonResult,
            markdownContent: procResult,
            extraInfo,
          },
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

    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'fail',
        result_all: null,
        result_nut: null,
        result: null,
      },
    });
    console.log('on process gemini error or chunk error', e);

    return Promise.reject(e);
  }
};

export const onProcessAttribute = async ({
  req,
  res,
  invalidatedInput,
  ocrList,
  sessionId,
  collateImageName,
  outputConfig,
  extraInfo,
  config,
  prefix,
  promptMakerFn,
}: {
  req: any;
  res: any;
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  collateImageName: string;
  outputConfig: any;
  extraInfo?: any;
  config?: { flash: boolean };
  prefix: string;
  promptMakerFn: Function;
}) => {
  const ocrName = `${prefix}_orc.json`; //? example attr_1_ocr.json
  const resultFieldName = `result_${prefix}`; //? example result_attr_1
  const resultFileName = (prefix ? `${prefix}` : '') + '.json';

  if (!outputConfig.other) {
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: true, data: { product: {} } })
    );

    writeJsonToFile(resultsDir + `/${sessionId}`, ocrName, JSON.stringify({}));

    let sessionPayload = {
      [resultFileName]: JSON.stringify({
        isSuccess: true,
        data: {
          jsonData: { isSuccess: true, data: { product: {} } },
          markdownContent: '',
        },
      }),
    };

    return Promise.resolve(sessionPayload);
  }

  try {
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
      ocrName,
      JSON.stringify(new_allText)
    );

    let sessionPayload = {
      [ocrName]: JSON.stringify(new_allText),
    };

    const finalSessionPayload = await onProcessImage({
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

      prompt: promptMakerFn({
        ocrText: JSON.stringify(new_allText),
        imageCount: [
          ...invalidatedInput.nutIncluded,
          ...invalidatedInput.nutExcluded,
        ]?.length,
      }),
      isMarkdown: true,
      sessionPayload,
      extraInfo,
      config,
    });

    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'unknown',
        [resultFieldName]: JSON.stringify(finalSessionPayload),
      },
    });
  } catch (e) {
    console.log('process other error', e);
  }
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

  try {
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

    const finalSessionPayload = await onProcessImage({
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
      // mapMdToObjectFunct: mapMarkdownNutToObject,
      sessionPayload,
    });

    console.log('update status to unknown');

    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'unknown',
        // result_all: JSON.stringify({}),
        result_nut: JSON.stringify(finalSessionPayload),
      },
    });
  } catch (e) {
    console.log('process nut error', e);
  }
};
