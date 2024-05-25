import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir } from '../../server';
import path from 'path';

const router = express.Router();

router.get('/get-result/:sessionId', async (req, res) => {
  // Validate that the file extension is .json
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.json({ isSuccess: false });
  }

  // Construct the full file path
  const filePath = path.join(resultsDir + `/${sessionId}`, sessionId);
  const allFilePath = path.join(
    resultsDir + `/${sessionId}`,
    'all-' + sessionId + '.json'
  );
  const nutFilePath = path.join(
    resultsDir + `/${sessionId}`,
    'nut-' + sessionId + '.json'
  );

  try {
    const [
      // allData,
      nutData,
    ] = await Promise.all([
      // fs.readFileSync(allFilePath, 'utf8'),
      fs.readFileSync(nutFilePath, 'utf8'),
    ]);

    // const allRes = JSON.parse(allData);
    const nutRes = JSON.parse(nutData);

    // const { isSuccess: allSuccess } = allRes || {};
    const { isSuccess: nutSuccess } = nutRes || {};

    if (
      nutSuccess === false
      // || allSuccess === false
    ) {
      res.json({ isSuccess: false });
    }

    let response = {
      // ...allRes,
      ...nutRes,
      product: {
        // ...allRes.product,
        factPanels: nutRes.product.factPanels,
      },
    };

    // removeFieldByPath(response, 'answerOfQuestion');
    // removeFieldByPath(response, 'answerOfRemindQuestion');
    // removeFieldByPath(response, 'answerOfFoundBug');
    // removeFieldByPath(response, 'answerOfFoundBug');
    // removeFieldByPath(response, 'product.certifierAndLogo');
    // removeFieldByPath(response, 'product.readAllConstants');
    // removeFieldByPath(response, 'answerOfQuestionsAboutNutritionFact');
    // removeFieldByPath(response, 'answerOfQuestionAboutNutritionFactTitle');
    // removeFieldByPath(response, 'answerOfQuestionAboutValidator');
    // removeFieldByPath(response, 'answerOfQuestionAboutLanguage');
    // removeFieldByPath(response, 'answerOfDebug');
    // removeFieldByPath(response, 'answerOfDebug_2');

    res.json(response);
  } catch (error) {
    // console.log('error', error);
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
