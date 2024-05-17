import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir } from '../../server';
import path from 'path';

const router = express.Router();

router.get('/get-result/:filename', (req, res) => {
  // Validate that the file extension is .json
  if (!req.params.filename.endsWith('.json')) {
    return res
      .status(400)
      .send('Invalid file type. Only JSON files are allowed.');
  }

  // Construct the full file path
  const filePath = path.join(resultsDir, req.params.filename);
  const fullResultfilePath = path.join(
    resultsDir,
    'full-' + req.params.filename
  );

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Processing images. Please wait');
      // Send a 404 error if the file is not found
      return res.status(200).send('Image is processing. Please wait');
    }
    try {
      const jsonData = JSON.parse(data);

      const { isSuccess } = jsonData;

      if (isSuccess !== false) {
        removeFieldByPath(jsonData, 'product.isFactPanelGoodToRead');
        removeFieldByPath(jsonData, 'product.certificationOrLogo');
        removeFieldByPath(jsonData, 'product.readAllConstants');
      }

      res.json(jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Error parsing data file.');
    }
  });
});

router.get('/get-history', (req, res) => {
  const historyPath = path.join(historyDir, 'history.json');

  fs.readFile(historyPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Wating for result');
      // Send a 404 error if the file is not found
      return res.status(404).send('history not found.');
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {}
  });
});

export default router;

type AnyObject = { [key: string]: any };

const removeFieldByPath = (obj: AnyObject, path: string): AnyObject => {
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
