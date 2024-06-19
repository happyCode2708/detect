import path, { resolve } from 'path';
import fs from 'fs';
import { historyDir, resultsDir } from '../../server';
// import { makePrompt, make_nut_prompt } from '../constants';
import sharp from 'sharp';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export const encodeImageToBase64 = (filePath: string) => {
  // Ensure the file path is absolute or correctly relative
  const absolutePath = path.resolve(filePath);
  // Read the file's buffer
  const fileBuffer = fs.readFileSync(absolutePath);
  // Convert the file's buffer to a Base64 string
  const base64Image = fileBuffer.toString('base64');
  return base64Image;
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
    let newWidth = Math.floor(width * scale);
    let newHeight = Math.floor(height * scale);

    // Adjust size if the image is slightly larger than the box due to rounding
    if (newWidth > max_width - 50 || newHeight > max_height - 50) {
      scale *= 0.96; // Reduce slightly
      newWidth = Math.floor(width * scale);
      newHeight = Math.floor(height * scale);
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
  const boxSize: [number, number] = [3600, 3600];
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
