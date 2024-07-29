import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';

const GENERAL_CONFIG = {
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.2,
    topP: 0.95,
  },

  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_ONLY_HIGH',
    },
  ] as any,
};

export const getGenerative = () => {
  const model = 'gemini-1.5-pro-001';
  const flash_model = 'gemini-1.5-flash-001';

  const googleCredentialString = Buffer.from(
    process.env.GOOGLE_CREDENTIALS as string,
    'base64'
  ).toString('utf-8');

  const googleCredential = JSON.parse(googleCredentialString);

  const vertex_ai_region_1 = new VertexAI({
    project: 'splendid-sonar-429704-g9',
    location: 'asia-east1',
    googleAuthOptions: {
      credentials: googleCredential,
    },
  });

  const vertex_ai_region_3 = new VertexAI({
    project: 'splendid-sonar-429704-g9',
    location: 'asia-east3',
    googleAuthOptions: {
      credentials: googleCredential,
    },
  });

  const generativeProModel_1 = vertex_ai_region_1.preview.getGenerativeModel({
    model,
    ...GENERAL_CONFIG,
  });

  const generativeProModel_3 = vertex_ai_region_3.preview.getGenerativeModel({
    model,
    ...GENERAL_CONFIG,
  });

  // (global as any).generativeModel = generativeModel;
  // (global as any).generativeModelName = model;

  (global as any).generativeModel = {
    region_1: generativeProModel_1,
    region_3: generativeProModel_3,
  };
  (global as any).generativeProModelName = model;

  const generativeFlashModel_1 = vertex_ai_region_1.preview.getGenerativeModel({
    model: flash_model,
    ...GENERAL_CONFIG,
  });

  const generativeFlashModel_3 = vertex_ai_region_3.preview.getGenerativeModel({
    model: flash_model,
    ...GENERAL_CONFIG,
  });

  // const generativeFlashModel_3 = vertex_ai_region_3.preview.getGenerativeModel({
  //   model: flash_model,
  //   ...GENERAL_CONFIG,
  // });

  (global as any).generativeFlashModel = {
    region_1: generativeFlashModel_1,
    region_3: generativeFlashModel_3,
  };
  (global as any).generativeFlashModelName = flash_model;
};
