const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: 'splendid-sonar-429704-g9',
  location: 'asia-southeast1',
});
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

const image1 = {
  inlineData: {
    mimeType: 'image/png',
    data: `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`,
  },
};
const text1 = {
  text: `do image have certifier logo ? (answer is boolean)
check all images and return result in below format for all images
  {
   \"image_1\": boolean, 
   \"image_2\": boolean
  ...
]`,
};

async function generateContent() {
  const req = {
    contents: [{ role: 'user', parts: [image1, text1] }],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
  }

  process.stdout.write(
    'aggregated response: ' + JSON.stringify(await streamingResp.response)
  );
}

generateContent();
