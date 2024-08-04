import { ImageAnnotatorClient } from '@google-cloud/vision';

export const getOcrText = async (imagePath: string): Promise<string[]> => {
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
