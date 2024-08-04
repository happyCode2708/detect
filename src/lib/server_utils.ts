import { writeJsonToFile } from './json';
import fs from 'fs';
import path from 'path';
import { historyDir } from '../server';

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
export const addUniqueStringToArrayString = (array: string[], item: string) => {
  if (!array.includes(item)) {
    array.push(item);
  }
  return array;
};
