import path from 'path';
import fs, { write } from 'fs';
import { historyDir, resultsDir } from '../server';
import sharp from 'sharp';
import { NEW_PROMPT } from '../constants';

// Function to encode image to Base64
export const encodeImageToBase64 = (filePath: string) => {
  // Ensure the file path is absolute or correctly relative
  const absolutePath = path.resolve(filePath);
  // Read the file's buffer
  const fileBuffer = fs.readFileSync(absolutePath);
  // Convert the file's buffer to a Base64 string
  const base64Image = fileBuffer.toString('base64');
  return base64Image;
};

export const addNewExtractionToHistory = async (
  id: string,
  historyData: any
) => {
  const historyFilePath = path.join(historyDir, 'history.json');
  try {
    fs.readFile(historyFilePath, 'utf8', (err: any, data) => {
      let history: any = []; // Initialize products as an empty array

      if (data) {
        history = JSON.parse(data);
      }

      history = [{ id, ...historyData }, ...history];

      writeJsonToFile(historyDir, 'history.json', JSON.stringify(history));
    });
  } catch (e) {}
};

export function writeJsonToFile(
  directory: string,
  fileName: string,
  content: any
) {
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
}

export const generateContent = async (image: any, text: any) => {
  if (!(global as any)?.generativeModel) return;

  const text1 = { text: 'what is the largest country?' };
  const req = {
    contents: [{ role: 'user', parts: [image, text] }],
  };

  const streamingResp = await (
    global as any
  ).generativeModel.generateContentStream(req);

  let chunk_response = [];

  let finalResponse = '';

  for await (const item of streamingResp.stream) {
    chunk_response.push(item);
    if (!item?.candidates) return;
    finalResponse = finalResponse + item?.candidates[0]?.content.parts[0].text;
  }

  return finalResponse;
};

const resizeAndCenterImage = async (
  imagePath: string,
  boxSize: [number, number]
): Promise<Buffer> => {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    const width = metadata.width; // Fallback to 1 if undefined
    const height = metadata.height; // Fallback to 1 if undefined

    if (!width || !height) {
      throw new Error(
        `Missing width or height in metadata for image: ${imagePath}`
      );
    }

    const max_width = boxSize[0];
    const max_height = boxSize[1];

    // Calculate the scaling factor, preserving the aspect ratio
    let scale = Math.min(max_width / width, max_height / height);
    let newWidth = Math.round(width * scale);
    let newHeight = Math.round(height * scale);

    // Adjust size if the image is slightly larger than the box due to rounding
    if (newWidth > max_width - 50 || newHeight > max_height - 50) {
      scale *= 0.93; // Reduce slightly
      newWidth = Math.round(width * scale);
      newHeight = Math.round(height * scale);
    }

    // Resize and pad the image
    const resizedImage = await image
      .resize(newWidth, newHeight)
      .extend({
        top: Math.floor((max_height - newHeight) / 2),
        bottom: Math.floor((max_height - newHeight) / 2),
        left: Math.floor((max_width - newWidth) / 2),
        right: Math.floor((max_width - newWidth) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 1 }, // black background
      })
      .toBuffer();

    return resizedImage;
  } catch (error: any) {
    console.error(`Error processing ${imagePath}: ${error?.message}`);
    throw error; // Re
  }
};

export const createCollage = async (
  imageFilePaths: string[],
  outputPath: string
): Promise<void> => {
  const boxSize: [number, number] = [900, 900];
  const images = await Promise.all(
    imageFilePaths.map((imagePath) => resizeAndCenterImage(imagePath, boxSize))
  );

  const imagesCount = images?.length;

  //* size c x r (c_max = 2)

  const rowCount = Math.ceil(imagesCount / 2);
  const columnCount = imagesCount == 1 ? 1 : 2;

  // Calculate the total width and maximum height
  let totalWidth = columnCount * boxSize[0];
  let totalHeight = rowCount * boxSize[1];

  // Create a black background collage canvas
  const collage = sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  });

  const composites = images.map((img, index) => {
    const xOffset = (index % 2) * boxSize[0];
    const yOffset = Math.floor(index / 2) * boxSize[1];
    const composite = { input: img, left: xOffset, top: yOffset };
    return composite;
  });

  // Apply all composites at once
  collage.composite(composites);

  await collage.toFile(outputPath);
};

export const onProcessGemini = async ({
  req,
  res,
  sessionId,
  collateImageName,
  collatedOuputPath,
  filePaths,
}: {
  req: any;
  res: any;
  sessionId: string;
  collateImageName: string;
  collatedOuputPath: string;
  filePaths: string[];
}) => {
  const base64Image = encodeImageToBase64(collatedOuputPath);

  const base64Full = `data:image/jpeg;base64,${base64Image}`;
  const image1 = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image,
    },
  };
  const text1 = {
    text: NEW_PROMPT,
  };

  const resultFileName = sessionId + '.json';

  addNewExtractionToHistory(sessionId, {
    collateImage: { name: collateImageName, url: collatedOuputPath },
    inputFilePaths: filePaths,
    result: {
      name: resultFileName,
      url: path.join(resultsDir, resultFileName),
    },
  });

  res.json({ resultFileName, images: [base64Full] });

  console.log('resultFileName: ', resultFileName);

  const gemini_result = await generateContent(image1, text1);

  if (!gemini_result) return;
  const procResult = gemini_result.split('```json\n')[1].split('```')[0];

  writeJsonToFile(resultsDir, resultFileName, JSON.stringify(procResult));
};
