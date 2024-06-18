import { writeJsonToFile, onProcessGemini } from '../utils';
import { mapOcrToPredictDataPoint } from '../lib/validator/mapOcrToPredictDataPoint';
import { resultsDir } from '../server';
import { makePrompt } from '../lib/promp/all_utils';
import { make_nut_prompt } from '../lib/promp/nut_utils';

import { ImageAnnotatorClient } from '@google-cloud/vision';
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
  if (filePaths?.length === 0) return [];

  return Promise.all(filePaths.map((path) => getOcrText(path)));
};

export const isImageHaveNutFact = (filePath: string) => {
  const imagePath = filePath;

  return new Promise((resolve, reject) => {
    const pythonPath =
      process.env.NODE_ENV !== 'production' ? 'src/python/' : 'dist/python/';
    execFile(
      process.env.pythonV || 'python',
      [`${pythonPath}detect.py`, imagePath],
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
    'product.analysis_detected_claims',
    'product.ingredients_group',
    'product.other_ingredients_group',
    'ingredients',
  ];

  fields.forEach((removeField) => {
    removeFieldByPath(rawResponse, removeField);
  });
};
export const createMapping = (enumList: string[]) => {
  const result: Record<string, string[]> = {};

  enumList.forEach((item) => {
    result[item] = [item];
  });

  return result;

  // const result =  {};

  // claims.forEach((item) => {
  //   result[item] = [item];
  // });
};

export const onProcessNut = async ({
  req,
  res,
  invalidatedInput,
  ocrList,
  sessionId,
  collateImageName,
  outputConfig,
}: {
  req: any;
  res: any;
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  collateImageName: string;
  outputConfig: any;
}) => {
  if (invalidatedInput?.nutIncluded?.length === 0 || !outputConfig.nut) {
    const resultFileName = 'nut-' + sessionId + '.json';

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: true, data: { product: { factPanel: [] } } })
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'nut-orc-' + sessionId + '.json',
      JSON.stringify({})
    );

    return;
  }

  const prefix = 'nut';

  const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    resultFileName,
    JSON.stringify({
      isSuccess: 'unknown',
      status: 'processing',
    })
  );

  // const nutText = ocrList.reduce(
  //   (accumulator: any, currentValue: any, idx: number) => {
  //     return {
  //       ...accumulator,
  //       [`ocrImage_${idx + 1}`]: currentValue,
  //     };
  //   },
  //   {}
  // );

  const new_nutText = ocrList.reduce(
    (accumulator: any, currentValue: any, idx: number) => {
      let [whole_text, ...array_string] = currentValue;
      let processed_whole_text = array_string.join(' ');
      return {
        ...accumulator,
        [`ocrImage_${idx + 1}`]: processed_whole_text,
      };
    },
    {}
  );

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'nut-orc-' + sessionId + '.json',
    JSON.stringify(new_nutText)
  );

  onProcessGemini({
    req,
    res,
    sessionId,
    collateImageName,
    collatedOuputPath: invalidatedInput.nutIncluded,
    prompt: make_nut_prompt({
      ocrText: JSON.stringify(new_nutText),
      imageCount: invalidatedInput.nutIncluded?.length,
    }),
    prefix,
  });
};

export const onProcessOther = async ({
  req,
  res,
  invalidatedInput,
  ocrList,
  sessionId,
  collateImageName,
  outputConfig,
}: {
  req: any;
  res: any;
  invalidatedInput: any;
  ocrList: any[];
  sessionId: string;
  collateImageName: string;
  outputConfig: any;
}) => {
  if (!outputConfig.other) {
    const resultFileName = 'all-' + sessionId + '.json';
    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      resultFileName,
      JSON.stringify({ isSuccess: true, data: { product: {} } })
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'all-orc-' + sessionId + '.json',
      JSON.stringify({})
    );

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'orc-claims' + sessionId + '.json',
      JSON.stringify({})
    );

    return;
  }

  const prefix = 'all';

  const resultFileName = (prefix ? `${prefix}-` : '') + sessionId + '.json';

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    resultFileName,
    JSON.stringify({
      isSuccess: 'unknown',
      status: 'processing',
    })
  );

  // const allText = ocrList.reduce(
  //   (accumulator: any, currentValue: any, idx: number) => {
  //     return {
  //       ...accumulator,
  //       [`ocrImage_${idx + 1}`]: currentValue,
  //     };
  //   },
  //   {}
  // );

  const new_allText = ocrList.reduce(
    (accumulator: any, currentValue: any, idx: number) => {
      let [whole_text, ...array_string] = currentValue;
      let processed_whole_text = array_string.join(' ');
      return {
        ...accumulator,
        [`ocrImage_${idx + 1}`]: processed_whole_text,
      };
    },
    {}
  );

  const { ocr_claims } = (await mapOcrToPredictDataPoint(new_allText)) || {};

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'all-orc-' + sessionId + '.json',
    JSON.stringify(new_allText)
  );

  writeJsonToFile(
    resultsDir + `/${sessionId}`,
    'orc-claims' + sessionId + '.json',
    JSON.stringify(ocr_claims)
  );

  onProcessGemini({
    req,
    res,
    sessionId,
    collateImageName,
    collatedOuputPath: [
      ...invalidatedInput.nutIncluded,
      ...invalidatedInput.nutExcluded,
    ],
    prompt: makePrompt({
      ocrText: JSON.stringify(new_allText),
      imageCount: [
        ...invalidatedInput.nutIncluded,
        ...invalidatedInput.nutExcluded,
      ]?.length,
      detectedClaims: JSON.stringify(ocr_claims),
    }),
    prefix,
  });
};
