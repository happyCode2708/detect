import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';

export const getGenerative = () => {
  const model = 'gemini-1.5-pro-001';
  // const model = 'gemini-1.5-flash-001';

  const googleCredentialString = Buffer.from(
    process.env.GOOGLE_CREDENTIALS as string,
    'base64'
  ).toString('utf-8');

  const googleCredential = JSON.parse(googleCredentialString);

  const vertex_ai = new VertexAI({
    project: 'splendid-sonar-429704-g9',
    location: 'asia-east1',
    googleAuthOptions: {
      credentials: googleCredential,
    },
  });

  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.2,
      topP: 0.95,
    },
    // safetySettings: [
    //   {
    //     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //     threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    //   },
    // ],
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
  });

  (global as any).generativeModel = generativeModel;
  (global as any).generativeModelName = model;
};
