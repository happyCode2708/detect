import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';

export const getGenerative = () => {
  require('dotenv').config();

  const model = 'gemini-1.5-pro-preview-0409';

  const googleCredentialString = Buffer.from(
    process.env.GOOGLE_CREDENTIALS as string,
    'base64'
  ).toString('utf-8');

  const googleCredential = JSON.parse(googleCredentialString);

  const vertex_ai = new VertexAI({
    project: 'vibrant-abbey-421304',
    location: 'asia-east1',
    googleAuthOptions: {
      credentials: googleCredential,
    },
  });

  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.3,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  (global as any).generativeModel = generativeModel;
};
