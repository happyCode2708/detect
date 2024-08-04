import { make_gpt4_o_prompt } from '../promp/gpt4-o-mini';
import { ChatCompletionContentPartImage } from 'openai/resources';

import { encodeImageToBase64 } from '@/lib/utils/image';

export const generateContentWithGpt = async (
  imagesPath: any[],
  text: any,
  config: any
) => {
  let chunkResponse = [] as any;
  let finalResponse = '';

  const model =
    config?.flash === true
      ? (global as any)?.generativeFlashModel?.[`region_${config?.region || 1}`]
      : (global as any)?.generativeModel?.[`region_${config?.region || 1}`];

  if (!model) return;

  const images: ChatCompletionContentPartImage[] = imagesPath.map((path) => {
    const base64Image = encodeImageToBase64(path);

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
};
