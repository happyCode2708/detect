import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir } from '../../server';
import path from 'path';

const router = express.Router();

router.get('/get-result/:filename', async (req, res) => {
  // Validate that the file extension is .json
  if (!req.params.filename.endsWith('.json')) {
    return res
      .status(400)
      .send('Invalid file type. Only JSON files are allowed.');
  }

  // Construct the full file path
  const filePath = path.join(resultsDir, req.params.filename);
  const allFilePath = path.join(resultsDir, 'all-' + req.params.filename);
  const nutFilePath = path.join(resultsDir, 'nut-' + req.params.filename);

  try {
    const [
      allData,
      // nutData
    ] = await Promise.all([
      fs.readFileSync(allFilePath, 'utf8'),
      // fs.readFileSync(nutFilePath, 'utf8'),
    ]);

    const allRes = JSON.parse(allData);
    // const nutRes = JSON.parse(nutData);

    res.json({
      ...allRes,
      product: {
        ...allRes.product,
        // factPanels: nutRes.product.factPanels,
      },
    });
  } catch (error) {
    return res.status(200).send('Image is processing. Please wait');
  }
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

const combineResult = (result: any) => {
  if (result.nut && result.all) {
    return {
      product: {
        ...result.all.product,
        factPanels: result.nut.product.factPanels,
      },
    };
  }

  return false;
};
