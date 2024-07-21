import fs from 'fs';
import jpeg from 'jpeg-js';
import {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
} from '@zxing/library';

export const findUpcFromImages = async (filePaths: string[]) => {
  // Replace 'path/to/barcode-image.png' with the path to your image file
  // const imagePath = path.resolve('path/to/barcode-image.png');

  const upcFromImageList = await Promise.all(
    filePaths.map((path: string) => decodeUpc(path))
  );

  let foundUpc =
    upcFromImageList
      ?.filter((item: any) => item)
      ?.find((item: any) => item?.length === 12) || null;

  return foundUpc;
};

export const decodeUpc = async (filePath: string) => {
  const imagePath = filePath;
  try {
    // Read the image file
    const jpegData = fs.readFileSync(imagePath);
    const rawImageData = jpeg.decode(jpegData, { useTArray: true });

    // Set up the decoding hints
    const hints = new Map();
    const formats = [BarcodeFormat.UPC_A, BarcodeFormat.UPC_E];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    // Create the barcode reader
    const reader = new MultiFormatReader();
    reader.setHints(hints);

    // Prepare the luminance data
    const len = rawImageData.width * rawImageData.height;
    const luminancesUint8Array = new Uint8ClampedArray(len);
    for (let i = 0; i < len; i++) {
      luminancesUint8Array[i] =
        ((rawImageData.data[i * 4] +
          rawImageData.data[i * 4 + 1] * 2 +
          rawImageData.data[i * 4 + 2]) /
          4) &
        0xff;
    }

    // Create the luminance source and binary bitmap
    const luminanceSource = new RGBLuminanceSource(
      luminancesUint8Array,
      rawImageData.width,
      rawImageData.height
    );
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    // Decode the barcode
    const result = reader.decode(binaryBitmap);
    console.log('Decoded barcode:', result.getText());
    return Promise.resolve(result.getText());
  } catch (error) {
    // console.error('Error decoding barcode:', error);
    return Promise.resolve(null);
  }
};
