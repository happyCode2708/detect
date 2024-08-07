import { encodeImageToBase64 } from '@/lib/image';

import { prisma } from '@/server';
import { make_markdown_nut_prompt } from '@/lib/promp/markdown_nut_utils';
import { Status } from '@prisma/client';
import { generateContentWithGpt } from '../gpt';

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

  const { chunkResponse, finalResponse: gemini_result } = config?.gpt
    ? (await generateContentWithGpt(imagesPath, prompt, config)) || {}
    : (await generateContent(imagesPath, prompt, config)) || {};

  if (!gemini_result) return;

  return Promise.resolve({ chunk: chunkResponse, text: gemini_result });
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

  const { text: markdownResult, chunk } =
    (await onProcessImage({
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
    })) || {};

  if (!markdownResult) return;

  const { promptTokenCount, candidatesTokenCount, totalTokenCount } =
    chunk?.response?.usageMetadata || {};

  const { prompt_tokens, completion_tokens, total_tokens } = chunk?.usage || {};

  await prisma.extractSession.update({
    where: { sessionId },
    data: {
      [prefix]: markdownResult,
      [`${prefix}_cost`]: config?.gpt
        ? costCompute({
            type: 'gpt',
            images: ocrList?.length,
            textInput: prompt_tokens,
            textOutput: completion_tokens,
          })
        : costCompute({
            type: config?.flash ? 'flash' : config?.gpt ? 'gpt' : '',
            images: ocrList?.length,
            textInput: promptTokenCount,
            textOutput: candidatesTokenCount,
          }),
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
  config: any,
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

  const { text: markdownResult, chunk } =
    (await onProcessImage({
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
    })) || {};

  if (!markdownResult) return;

  const { promptTokenCount, candidatesTokenCount, totalTokenCount } =
    chunk?.response?.usageMetadata || {};

  const { prompt_tokens, completion_tokens, total_tokens } = chunk?.usage || {};

  await prisma.extractSession.update({
    where: { sessionId },
    data: {
      [prefix]: markdownResult,
      [`${prefix}_cost`]: config?.gpt
        ? costCompute({
            type: 'gpt',
            images: ocrList?.length,
            textInput: prompt_tokens,
            textOutput: completion_tokens,
          })
        : costCompute({
            type: config?.flash ? 'flash' : config?.gpt ? 'gpt' : '',
            images: ocrList?.length,
            textInput: promptTokenCount,
            textOutput: candidatesTokenCount,
          }),
    },
  });
};

const costCompute = ({
  type,
  images,
  textInput,
  textOutput,
}: {
  type: 'flash' | any;
  images: number;
  textInput: number;
  textOutput: number;
}) => {
  const basePrice =
    type === 'flash' ? PRICES.FLASH : type === 'gpt' ? PRICES.GPT : PRICES.PRO;

  if (type === 'gpt') {
    return (
      (basePrice.textInput * textInput) / 1000000 +
      (basePrice.textOutput * textOutput) / 1000000
    );
  }

  return (
    basePrice.image * images +
    (basePrice.textInput * textInput * 4) / 1000 +
    (basePrice.textOutput * textOutput * 4) / 1000
  );
};

const PRICES = {
  FLASH: {
    image: 0.00002,
    textInput: 0.00001875, //per 1000
    textOutput: 0.000075, //per 1000
  },
  PRO: {
    image: 0.001315,
    textInput: 0.00125,
    textOutput: 0.00375,
  },
  GPT: {
    image: 0,
    textInput: 0.15, //per 1M tokens
    textOutput: 0.6, //per 1M tokens
  },
};
