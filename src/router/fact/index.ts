import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir } from '../../server';
import path from 'path';
import { writeJsonToFile } from '../../utils';
import { lowerCase } from 'lodash';
import { responseValidator } from '../../lib/validator/main';
import { removeFieldByPath, removeRawFieldData } from '../../lib/server_utils';

const router = express.Router();

router.get('/get-result/:sessionId', async (req, res) => {
  // Validate that the file extension is .json
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.json({ isSuccess: false });
  }

  const allFilePath = path.join(
    resultsDir + `/${sessionId}`,
    'all-' + sessionId + '.json'
  );
  const nutFilePath = path.join(
    resultsDir + `/${sessionId}`,
    'nut-' + sessionId + '.json'
  );

  const finalResultPath = path.join(
    resultsDir + `/${sessionId}`,
    'validated-output-' + sessionId + '.json'
  );

  try {
    const [finalData] = await Promise.all([
      fs.readFileSync(finalResultPath, 'utf8'),
    ]);

    const finalRes = JSON.parse(finalData);

    return res.json(finalRes);
  } catch (err) {}

  try {
    const [allData, nutData] = await Promise.all([
      fs.readFileSync(allFilePath, 'utf8'),
      fs.readFileSync(nutFilePath, 'utf8'),
    ]);

    const allRes = JSON.parse(allData);
    const nutRes = JSON.parse(nutData);

    const { isSuccess: allSuccess, status: allStatus } = allRes || {};
    const { isSuccess: nutSuccess, status: nutStatus } = nutRes || {};

    if (allStatus === 'processing' || nutStatus === 'processing') {
      return res.status(200).send({
        isSuccess: 'unknown',
        status: 'processing',
        message: 'Processing images',
      });
    }

    if (nutSuccess === false || allSuccess === false) {
      return res.json({ isSuccess: false });
    }

    let response = {
      ...allRes.data,
      ...nutRes.data,
      validatorAndFixBug: {
        ...allRes.data.validatorAndFixBug,
        ...nutRes.data.validatorAndFixBug,
      },
      product: {
        ...allRes.data.product,
        factPanels: nutRes.data.product.factPanels,
      },
    };

    let validatedResponse = await responseValidator(response);

    removeRawFieldData(validatedResponse);

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'validated-output-' + sessionId + '.json',
      JSON.stringify({
        isSuccess: true,
        data: validatedResponse,
        message: 'Successfully process image',
      })
    );
  } catch (error) {
    console.log('error', error);
    return res
      .status(500)
      .json({ isSuccess: false, message: 'Something went wrong' });

    // return res.status(200).send('Image is processing. Please wait');
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
