import vision, { ImageAnnotatorClient } from '@google-cloud/vision';
import { makePrompt, make_nut_prompt } from '../constants';
const { execFile } = require('child_process');

export const getOcrText = async (imagePath: string): Promise<string> => {
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
          // console.log('Bounds: ' + vertices.join(', '));
        });
        return resolve(JSON.stringify(wholeText));
      } else {
        console.log('No text detected.');
        return resolve('');
      }
    } catch (e) {
      console.log('Error', e);
      return resolve('');
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
      'python',
      ['detect.py', imagePath],
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
          // return res.status(500).send(error);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          // return res.status(500).send(stderr);
        }
        console.log(stdout);
        console.log(typeof stdout);
        console.log('result', stdout.split('```')?.[1]);

        const stringResult = stdout.split('```')?.[1];
        return resolve(stringResult === 'true');

        // const detections = JSON.parse(stdout);
        // console.log('detection')
        // res.json(detections);
        // return resolve(detections);
        // fs.unlinkSync(imagePath); // Delete the uploaded file after processing
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
    nutExcluded: [],
  };

  detects.forEach((isNutFactFound, idx) => {
    if (isNutFactFound) {
      validateImages.nutIncluded = [
        ...validateImages.nutIncluded,
        filePaths[idx],
      ];
    } else {
      validateImages.nutExcluded = [
        ...validateImages.nutExcluded,
        filePaths[idx],
      ];
    }
  });

  return validateImages;
};
