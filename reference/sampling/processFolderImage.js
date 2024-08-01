const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

const batchSize = 4; // Number of images to process at a time
const maxRequestsPerMinute = 12; // Maximum number of requests per minute
const requestInterval = 60000 / maxRequestsPerMinute; // Interval between requests

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function processBatch({ batch, directoryPath }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Does the image have a certifier logo? (answer is boolean)
    
    check all images and return result in below format for all images:
    
    START_RESULT
    {
      "image_1": boolean, 
      "image_2": boolean
    }
    END_RESULT
    `;

    const imageParts = batch.map((file) => {
      const filePath = path.join(directoryPath, file);
      const fileData = fs.readFileSync(filePath);
      const base64Data = fileData.toString('base64');

      return {
        inlineData: {
          mimeType: 'image/png', // Adjust based on image type
          data: base64Data,
        },
      };
    });

    const result = await model.generateContent([...imageParts, prompt]);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error(`Error processing batch:`, error);
    return {};
  }
}

async function processImages({ directoryPath }) {
  // const directoryPath = './images'; // Path to your image folder
  const imagesWithLogo = [];
  const imagesWithoutLogo = [];

  const files = fs.readdirSync(directoryPath);
  const batches = [];

  // Create batches
  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(files.slice(i, i + batchSize));
  }

  let requestCount = 0;

  for (const batch of batches) {
    // Check if we need to wait before sending the next request

    if (requestCount >= maxRequestsPerMinute) {
      console.log('Waiting before sending more requests...');
      await sleep(requestInterval);
      requestCount = 0;
    }

    const results = await processBatch({ batch, directoryPath });

    // Process results
    batch.forEach((file, index) => {
      const resultKey = `image_${index + 1}`;
      if (results[resultKey]) {
        imagesWithLogo.push(file);
      } else {
        imagesWithoutLogo.push(file);
      }
    });

    requestCount++;
  }

  // Write results to JSON files
  fs.writeFileSync(
    path.join(directoryPath, 'imagesWithLogo.json'),
    JSON.stringify(imagesWithLogo, null, 2)
  );
  fs.writeFileSync(
    path.join(directoryPath, 'imagesWithoutLogo.json'),
    JSON.stringify(imagesWithoutLogo, null, 2)
  );

  console.log('Images with certifier logo:', imagesWithLogo);
  console.log('Images without certifier logo:', imagesWithoutLogo);
}

processImages();
