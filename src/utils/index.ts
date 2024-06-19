import path, { resolve } from 'path';
import fs from 'fs';
import { historyDir, resultsDir } from '../server';
// import { makePrompt, make_nut_prompt } from '../constants';
import sharp from 'sharp';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// const express = require('express');
// const multer = require('multer');
const { execFile } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// Function to encode image to Base64
// export const encodeImageToBase64 = (filePath: string) => {
//   // Ensure the file path is absolute or correctly relative
//   const absolutePath = path.resolve(filePath);
//   // Read the file's buffer
//   const fileBuffer = fs.readFileSync(absolutePath);
//   // Convert the file's buffer to a Base64 string
//   const base64Image = fileBuffer.toString('base64');
//   return base64Image;
// };

// export const addNewExtractionToHistory = async (
//   id: string,
//   historyData: any
// ) => {
//   const historyFilePath = path.join(historyDir, 'history.json');
//   try {
//     fs.readFile(historyFilePath, 'utf8', (err: any, data) => {
//       let history: any = []; // Initialize products as an empty array

//       if (data) {
//         history = JSON.parse(data);
//       }

//       history = [{ id, ...historyData }, ...history];

//       writeJsonToFile(historyDir, 'history.json', JSON.stringify(history));
//     });
//   } catch (e) {}
// };

// export function writeJsonToFile(
//   directory: string,
//   fileName: string,
//   content: any
// ) {
//   // Check if the directory exists
//   if (!fs.existsSync(directory)) {
//     // If it does not exist, create it
//     console.log('does not exist');
//     fs.mkdirSync(directory, { recursive: true });
//   }

//   // Define the complete file path
//   const filePath = path.join(directory, fileName);

//   // Write the JSON string to a file
//   fs.writeFile(filePath, content, (err) => {
//     if (err) {
//       console.log('Error writing file:', err);
//     } else {
//       console.log(
//         `JSON data is written to the file successfully at ${filePath}.`
//       );
//     }
//   });
// }

// export const generateContent = async (images: any[], text: any) => {
//   if (!(global as any)?.generativeModel) return;

//   const req = {
//     contents: [{ role: 'user', parts: [...images, text] }],
//   };

//   const streamingResp = await (
//     global as any
//   ).generativeModel.generateContentStream(req);

//   let chunkResponse = [];

//   let finalResponse = '';

//   for await (const item of streamingResp.stream) {
//     chunkResponse.push(item);
//     if (!item?.candidates) return;
//     finalResponse =
//       finalResponse + item?.candidates[0]?.content?.parts?.[0]?.text;
//   }

//   return { chunkResponse, finalResponse };
// };

// const resizeAndCenterImage = async (
//   imagePath: string,
//   boxSize: [number, number]
// ): Promise<Buffer> => {
//   try {
//     const image = sharp(imagePath);
//     const metadata = await image.metadata();

//     const width = metadata.width; // Fallback to 1 if undefined
//     const height = metadata.height; // Fallback to 1 if undefined

//     if (!width || !height) {
//       throw new Error(
//         `Missing width or height in metadata for image: ${imagePath}`
//       );
//     }

//     const max_width = boxSize[0];
//     const max_height = boxSize[1];

//     // Calculate the scaling factor, preserving the aspect ratio
//     let scale = Math.min(max_width / width, max_height / height);
//     let newWidth = Math.floor(width * scale);
//     let newHeight = Math.floor(height * scale);

//     // Adjust size if the image is slightly larger than the box due to rounding
//     if (newWidth > max_width - 50 || newHeight > max_height - 50) {
//       scale *= 0.96; // Reduce slightly
//       newWidth = Math.floor(width * scale);
//       newHeight = Math.floor(height * scale);
//     }

//     // Resize and pad the image
//     const resizedImage = await image
//       .resize(newWidth, newHeight)
//       .extend({
//         top: Math.floor((max_height - newHeight) / 2),
//         bottom: Math.floor((max_height - newHeight) / 2),
//         left: Math.floor((max_width - newWidth) / 2),
//         right: Math.floor((max_width - newWidth) / 2),
//         background: { r: 0, g: 0, b: 0, alpha: 1 }, // black background
//       })
//       .toBuffer();

//     return resizedImage;
//   } catch (error: any) {
//     console.error(`Error processing ${imagePath}: ${error?.message}`);
//     throw error; // Re
//   }
// };

// export const createCollage = async (
//   imageFilePaths: string[],
//   outputPath: string
// ): Promise<void> => {
//   const boxSize: [number, number] = [3600, 3600];
//   const images = await Promise.all(
//     imageFilePaths.map((imagePath) => resizeAndCenterImage(imagePath, boxSize))
//   );

//   const imagesCount = images?.length;

//   //* size c x r (c_max = 2)

//   const rowCount = Math.ceil(imagesCount / 2);
//   const columnCount = imagesCount == 1 ? 1 : 2;

//   // Calculate the total width and maximum height
//   let totalWidth = columnCount * boxSize[0];
//   let totalHeight = rowCount * boxSize[1];

//   // Create a black background collage canvas
//   const collage = sharp({
//     create: {
//       width: totalWidth,
//       height: totalHeight,
//       channels: 4,
//       background: { r: 0, g: 0, b: 0, alpha: 1 },
//     },
//   });

//   const composites = images.map((img, index) => {
//     const xOffset = (index % 2) * boxSize[0];
//     const yOffset = Math.floor(index / 2) * boxSize[1];
//     const composite = { input: img, left: xOffset, top: yOffset };
//     return composite;
//   });

//   // Apply all composites at once
//   collage.composite(composites);

//   await collage.toFile(outputPath);
// };

// export const onProcessGemini = async ({
//   req,
//   res,
//   sessionId,
//   collateImageName,
//   collatedOuputPath,
//   prefix = '',
//   prompt,
// }: {
//   req: any;
//   res: any;
//   sessionId: string;
//   collateImageName: string;
//   collatedOuputPath: string[];
//   prefix?: string;
//   prompt: string;
// }) => {
//   // const base64Image = encodeImageToBase64(collatedOuputPath);

//   // const base64Full = `data:image/jpeg;base64,${base64Image}`;
//   // const image1 = {
//   //   inlineData: {
//   //     mimeType: 'image/png',
//   //     data: base64Image,
//   //   },
//   // };
//   const images = collatedOuputPath.map((path) => {
//     const base64Image = encodeImageToBase64(path);
//     return {
//       inlineData: {
//         mimeType: 'image/png',
//         data: base64Image,
//       },
//     };
//   });

//   // make_nut_prompt({
//   //   ocrText: JSON.stringify(ocrText),
//   //   imageCount: collatedOuputPath?.length,
//   // })

//   const text1 = {
//     text: prompt,
//   };

//   const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

//   // addNewExtractionToHistory(sessionId, {
//   //   collateImage: { name: collateImageName, url: collatedOuputPath },
//   //   inputFilePaths: collatedOuputPath,
//   //   result: {
//   //     name: resultFileName,
//   //     url: path.join(resultsDir, resultFileName),
//   //   },
//   // });

//   writeJsonToFile(
//     resultsDir + `/${sessionId}`,
//     'prompt-' + resultFileName,
//     text1.text
//   );

//   try {
//     const { chunkResponse, finalResponse: gemini_result } =
//       (await generateContent(images, text1)) || {};

//     if (!gemini_result) return;
//     //! try to parse
//     const fullResult = gemini_result;
//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'full-' + resultFileName,
//       JSON.stringify(fullResult)
//     );
//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'chunk-' + resultFileName,
//       JSON.stringify(chunkResponse)
//     );

//     const procResult = gemini_result?.includes('```json')
//       ? gemini_result?.split('```json\n')[1].split('```')[0]
//       : gemini_result;

//     const result = JSON.parse(procResult);
//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       resultFileName,
//       JSON.stringify({
//         isSuccess: true,
//         data: result,
//       })
//     );
//   } catch (e) {
//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       resultFileName,
//       JSON.stringify({ isSuccess: false })
//     );

//     console.log('some thing went wrong', e);
//   }
// };
