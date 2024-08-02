const fs = require('fs');
const path = require('path');
const { toLower } = require('lodash');

const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { promisify } = require('util');

const BATCH_INDEXES = [29, 30, 31];

const sleep = promisify(setTimeout);

const batchSize = 4; // Number of images to process at a time
const maxRequestsPerMinute = 13; // Maximum number of requests per minute
const requestInterval = 60000 / maxRequestsPerMinute; // Interval between requests

const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

const genAI_1 = new GoogleGenerativeAI(process.env.API_KEY_1);
const genAI_2 = new GoogleGenerativeAI(process.env.API_KEY_2);
const genAI_3 = new GoogleGenerativeAI(process.env.API_KEY_3);
// const genInstances = [genAI_3, genAI_1, genAI_2];
const genInstances = [genAI_3, genAI_3];

let INSTANCE_IDX = 0;
let FAILED = false;

const processBatch = async ({ batch, directoryPath }) => {
  try {
    const model = genInstances?.[INSTANCE_IDX]?.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    if (!model) return;

    const prompt = `
    Does the image have a certifier logo? (answer is boolean)

    check all images and return exact result in below format for all images:
    
    START_RESULT
    {
      "image_1": boolean, 
      "image_2": boolean,
      "image_3": boolean,
      "image_4": boolean
    }
    END_RESULT

    IMPORTANT NOTES:
    + only give short answer with above format
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
    console.error(`Error processing batch:`, JSON.stringify(error));
    return error?.['statusText'];
  }
};

const processImages = async ({ directoryPath }) => {
  // const directoryPath = './images'; // Path to your image folder

  let imagesWithLogo = [];
  let imagesWithoutLogo = [];

  const files = fs.readdirSync(directoryPath);
  const batches = [];

  // Create batches
  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(
      files
        .slice(i, i + batchSize)
        ?.filter(
          (fileName) =>
            !fileName?.includes('.json') && !fileName?.includes('.DS_Store')
        )
    );
  }

  let requestCount = 0;

  for (const index in batches) {
    // Check if we need to wait before sending the next request

    const batch = batches?.[index];
    await sleep(requestInterval);

    let retry = 0;

    try {
      // console.log('batch - ' + index);
      console.log(`Inst ${INSTANCE_IDX} - Batch Index: ${Number(index) + 1}`);
      let res = await processBatch({ batch, directoryPath });

      if (res === 'Service Unavailable' || res === 'Too Many Requests') {
        res = await keepRetry(retry, index, batch, directoryPath);
      }

      if (res === 'END_PROCESS') {
        FAILED = true;
        break;
      }

      // console.log(results);

      const results = processResultResult(res);

      // Process results
      batch.forEach((file, index) => {
        const resultKey = `image_${index + 1}`;

        const processed_results = results?.[resultKey];

        console.log(`${file} ${processed_results}`);

        if (processed_results !== false && processed_results !== true) {
          imagesWithLogo.push(file);
          return;
        }

        if (processed_results) {
          imagesWithLogo.push(file);
        } else {
          imagesWithoutLogo.push(file);
        }
      });
    } catch (e) {
      console.log('e', e);
      batch.forEach((file, index) => {
        imagesWithLogo.push(file);
      });
    }

    requestCount++;
  }

  // Write results to JSON files
  if (FAILED === true) {
    imagesWithLogo = [];
    imagesWithoutLogo = [];
  }

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
};

const keepRetry = async (retry, index, batch, directoryPath) => {
  while (retry < 20) {
    console.log(`Inst ${INSTANCE_IDX} Retry Batch Index: ${Number(index) + 1}`);
    await sleep(requestInterval * (retry + 1));
    res = await processBatch({ batch, directoryPath });
    if (res === 'Service Unavailable') {
      retry++;
      await keepRetry(retry, index, batch, directoryPath);
    } else if (res === 'Too Many Requests') {
      if (INSTANCE_IDX < genInstances?.length - 1) {
        console.log('come here');
        retry++;
        INSTANCE_IDX++;
        await keepRetry(retry, index, batch, directoryPath);
      } else {
        return Promise.resolve('END_PROCESS');
      }
    } else {
      return Promise.resolve(res);
    }
  }
};

const processResultResult = (result) => {
  const json = result?.split('START_RESULT')?.[1]?.split('END_RESULT')?.[0];

  if (!result) return {};

  try {
    const result = JSON.parse(json);

    return result;
  } catch (e) {
    return {};
  }
};

// processImages({
//   directoryPath: `/Users/duynguyen/Downloads/yolo/data/${BATCH_INDEX}`,
// });

const run = async () => {
  for (const index in BATCH_INDEXES) {
    const main_batch_index = BATCH_INDEXES[index];

    console.log(`folder group ${main_batch_index} start`);

    await processImages({
      directoryPath: `/Users/duynguyen/Downloads/yolo/data/${main_batch_index}`,
    });
  }
};

run();
