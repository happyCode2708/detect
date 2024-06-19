import path, { resolve } from 'path';
import fs from 'fs';
import { historyDir, resultsDir } from '../../server';
// import { makePrompt, make_nut_prompt } from '../constants';
// import sharp from 'sharp';
// import { ImageAnnotatorClient } from '@google-cloud/vision';

export const writeJsonToFile = (
  directory: string,
  fileName: string,
  content: any
) => {
  // Check if the directory exists
  if (!fs.existsSync(directory)) {
    // If it does not exist, create it
    console.log('does not exist');
    fs.mkdirSync(directory, { recursive: true });
  }

  // Define the complete file path
  const filePath = path.join(directory, fileName);

  // Write the JSON string to a file
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log(
        `JSON data is written to the file successfully at ${filePath}.`
      );
    }
  });
};
