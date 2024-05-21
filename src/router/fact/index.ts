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
  const allFilePath = path.join(resultsDir, 'all-' + req.params.filename);
  const nutFilePath = path.join(resultsDir, 'nut-' + req.params.filename);

  let result = {
    nut: null,
    all: null,
  };

  fs.readFile(nutFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Processing images. Please wait');
      // Send a 404 error if the file is not found
      // return res.status(200).send('Image is processing. Please wait');
      return;
    }
    try {
      const jsonData = JSON.parse(data);

      const { isSuccess } = jsonData;

      if (isSuccess !== false) {
        //! production only
        // removeFieldByPath(jsonData, 'answerOfQuestionsAboutNutritionFact');
        // removeFieldByPath(jsonData, 'answerOfQuestionAboutNutritionFactTitle');
        // removeFieldByPath(jsonData, 'answerOfQuestion');
        // removeFieldByPath(jsonData, 'answerOfRemindQuestion');
        // removeFieldByPath(jsonData, 'product.certifierAndLogo');
        // removeFieldByPath(jsonData, 'product.readAllConstants');
        // removeFieldByPath(jsonData, 'simpleOCRresult');
      }

      // res.json(jsonData);
      result.nut = jsonData;
      const procRes = combineResult(result);
      if (res) {
        res.json(procRes);
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Error parsing data file.');
    }
  });

  fs.readFile(allFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Processing images. Please wait');
      // Send a 404 error if the file is not found
      // return res.status(200).send('Image is processing. Please wait');
      return;
    }
    try {
      const jsonData = JSON.parse(data);

      const { isSuccess } = jsonData;

      if (isSuccess !== false) {
        //! production only
        // removeFieldByPath(jsonData, 'answerOfQuestionsAboutNutritionFact');
        // removeFieldByPath(jsonData, 'answerOfQuestionAboutNutritionFactTitle');
        // removeFieldByPath(jsonData, 'answerOfQuestion');
        // removeFieldByPath(jsonData, 'answerOfRemindQuestion');
        // removeFieldByPath(jsonData, 'product.certifierAndLogo');
        // removeFieldByPath(jsonData, 'product.readAllConstants');
        // removeFieldByPath(jsonData, 'simpleOCRresult');
      }

      // res.json(jsonData);
      result.all = jsonData;
      const procRes = combineResult(result);
      if (res) {
        res.json(procRes);
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Error parsing data file.');
    }
  });

  // fs.readFile(filePath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Processing images. Please wait');
  //     // Send a 404 error if the file is not found
  //     return res.status(200).send('Image is processing. Please wait');
  //   }
  //   try {
  //     const jsonData = JSON.parse(data);

  //     const { isSuccess } = jsonData;

  //     if (isSuccess !== false) {
  //       //! production only
  //       // removeFieldByPath(jsonData, 'answerOfQuestionsAboutNutritionFact');
  //       // removeFieldByPath(jsonData, 'answerOfQuestionAboutNutritionFactTitle');
  //       // removeFieldByPath(jsonData, 'answerOfQuestion');
  //       // removeFieldByPath(jsonData, 'answerOfRemindQuestion');
  //       // removeFieldByPath(jsonData, 'product.certifierAndLogo');
  //       // removeFieldByPath(jsonData, 'product.readAllConstants');
  //       // removeFieldByPath(jsonData, 'simpleOCRresult');
  //     }

  //     res.json(jsonData);
  //   } catch (parseError) {
  //     console.error('Error parsing JSON:', parseError);
  //     res.status(500).send('Error parsing data file.');
  //   }
  // });
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
