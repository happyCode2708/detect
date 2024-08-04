import { encodeImageToBase64 } from '@/lib/image';

import { prisma } from '@/server';
import { make_markdown_nut_prompt } from '@/lib/promp/markdown_nut_utils';
import { Status } from '@prisma/client';

export const generateContent = async (
  imagesPath: any[],
  text: any,
  config: any
) => {
  let chunkResponse = [] as any;
  let finalResponse = '';

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

  const model =
    config?.flash === true
      ? (global as any)?.generativeFlashModel?.[`region_${config?.region || 1}`]
      : (global as any)?.generativeModel?.[`region_${config?.region || 1}`];

  if (!model) return;

  const req = {
    contents: [{ role: 'user', parts: [...images, geminiText] }],
  };

  if (config?.stream) {
    const streamingResp = await model.generateContentStream(req);

    for await (const item of streamingResp.stream) {
      const text = item?.candidates[0]?.content?.parts?.[0]?.text || '';
      // console.log(text);
      finalResponse = finalResponse + text;
      chunkResponse = [...chunkResponse, item];

      const isForceFinish = item?.candidates[0]?.finishReason === 'RECITATION';

      if (isForceFinish) {
        throw new Error('force to stop');
        return;
      }
    }

    return { chunkResponse, finalResponse };
  } else {
    const streamingResp = await model.generateContent(req);

    chunkResponse = streamingResp;
    finalResponse =
      streamingResp?.response?.candidates[0]?.content?.parts?.[0]?.text || '';
    return { chunkResponse, finalResponse };
  }
};

export const onProcessImage = async ({
  inputImages,
  prompt,
  extraInfo,
  config,
}: {
  inputImages: string[];
  prefix?: string;
  prompt: string;
  extraInfo?: any;
  config?: any;
}) => {
  const imagesPath = inputImages;

  const { chunkResponse, finalResponse: gemini_result } =
    (await generateContent(imagesPath, prompt, config)) || {};

  if (!gemini_result) return;

  return Promise.resolve(gemini_result);
};

export const onProcessAttribute = async ({
  invalidatedInput,
  ocrList,
  sessionId,
  outputConfig,
  extraInfo,
  config,
  prefix,
  promptMakerFn,
}: {
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  outputConfig: any;
  extraInfo?: any;
  config?: any;
  prefix: string;
  promptMakerFn: Function;
}) => {
  if (!outputConfig.other) {
    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: Status.FAIL,
        [prefix]: '',
      },
    });
    return;
  }

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

  const markdownResult = await onProcessImage({
    inputImages: [
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
    extraInfo,
    config,
  });

  if (!markdownResult) return;

  await prisma.extractSession.update({
    where: { sessionId },
    data: {
      [prefix]: markdownResult,
    },
  });
};

export const onProcessNut = async ({
  invalidatedInput,
  ocrList,
  sessionId,
  outputConfig,
  config,
  prefix,
}: {
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  outputConfig: any;
  config?: any;
  prefix: string;
}) => {
  if (!outputConfig.nut) {
    await prisma.extractSession.update({
      where: { sessionId },
      data: {
        [prefix]: '',
      },
    });
    return;
  }

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

  const markdownResult = await onProcessImage({
    inputImages: [
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
    config,
  });

  if (!markdownResult) return;

  await prisma.extractSession.update({
    where: { sessionId },
    data: {
      [prefix]: markdownResult,
    },
  });
};
