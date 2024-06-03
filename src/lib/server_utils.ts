import vision, { ImageAnnotatorClient } from '@google-cloud/vision';
const { execFile } = require('child_process');

export const getOcrText = async (
  imagePath: string
): Promise<string | any[]> => {
  const ggVision: ImageAnnotatorClient = (global as any).ggVision;

  return new Promise(async (resolve, reject) => {
    try {
      const results = await ggVision.textDetection(imagePath);
      const detections = results[0].textAnnotations;
      if (!detections) return;
      if (detections.length > 0) {
        let arrayText: any[] = [];
        let wholeText: string = '';
        detections.forEach((text) => {
          arrayText.push(text.description);
          wholeText = wholeText + ' ' + text.description;
          if (!text.boundingPoly) return;
          if (!text.boundingPoly.vertices) return;

          const vertices = text.boundingPoly.vertices.map(
            (vertex) => `(${vertex.x},${vertex.y})`
          );
        });
        return resolve(arrayText);
      } else {
        console.log('No text detected.');
        return resolve([]);
      }
    } catch (e) {
      console.log('Error', e);
      return resolve([]);
    }
  });
};

export const getOcrTextAllImages = async (filePaths: string[]) => {
  return Promise.all(filePaths.map((path) => getOcrText(path)));
};

export const isImageHaveNutFact = (filePath: string) => {
  const imagePath = filePath;

  return new Promise((resolve, reject) => {
    execFile(
      process.env.pythonV || 'python',
      ['src/python/detect.py', imagePath],
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(stdout);
        console.log(typeof stdout);
        console.log('result', stdout.split('```')?.[1]);

        const stringResult = stdout.split('```')?.[1];
        return resolve(stringResult === 'true');
      }
    );
  });
};

export const findImagesContainNutFact = async (filePaths: string[]) => {
  const detects = await Promise.all(
    filePaths.map((path: string) => isImageHaveNutFact(path))
  );

  let validateImages: any = {
    nutIncluded: [],
    nutIncludedIdx: [],
    nutExcluded: [],
    nutExcludedIdx: [],
  };

  detects.forEach((isNutFactFound, idx) => {
    if (isNutFactFound) {
      validateImages.nutIncluded = [
        ...validateImages.nutIncluded,
        filePaths[idx],
      ];
      validateImages.nutIncludedIdx = [...validateImages.nutIncludedIdx, idx];
    } else {
      validateImages.nutExcluded = [
        ...validateImages.nutExcluded,
        filePaths[idx],
      ];
      validateImages.nutExcludedIdx = [...validateImages.nutExcludedIdx, idx];
    }
  });

  return validateImages;
};

export const addUniqueString = (array: string[], item: string) => {
  if (!array.includes(item)) {
    array.push(item);
  }
  return array;
};

type AnyObject = { [key: string]: any };

export const removeFieldByPath = (obj: AnyObject, path: string): AnyObject => {
  const keys = path.split('.');
  let current: AnyObject = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined) {
      return obj; // Path does not exist
    }
    current = current[keys[i]] as AnyObject;
  }

  delete current[keys[keys.length - 1]];
  return obj;
};

export const removeRawFieldData = (rawResponse: object) => {
  const fields = [
    'validatorAndFixBug',
    'product.validatorAndFixBug',
    'product.certifierAndLogo',
    'product.content_in_spanish_must_be_prohibited',
    'product.allergen.allergen_freeOf',
    'product.allergen.allergen_contain',
    'product.allergen.allergen_containOnEquipment',
    'product.contain_and_notContain.product_contain',
    'product.contain_and_notContain.product_does_not_contain',
    'product.process',
    'product.marketingAll.social_media_check',
  ];

  fields.forEach((removeField) => {
    removeFieldByPath(rawResponse, removeField);
  });
};
