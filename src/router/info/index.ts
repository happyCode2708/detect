import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir, prisma } from '../../server';
import path from 'path';
import { writeJsonToFile } from '../../lib/json';
import { responseValidator } from '../../lib/validator/main';
import { removeRawFieldData } from '@/lib/mapper/removeRawFieldData';
import { mapMdAttributeToObject } from '../../lib/mapper/mapMdAttributeToObject';
import { mapMdNutToObject } from '../../lib/mapper/mapMdNutToObject';
import { attr } from 'cheerio/lib/api/attributes';
import { Status } from '@prisma/client';
import { poolingSessionResult } from './handler/pooling-session-result';
import { getSessionResult } from './handler/get-session-result';

const router = express.Router();

// router.get('/get-result/:sessionId', async (req, res) => {
//   // Validate that the file extension is .json
//   const sessionId = req.params.sessionId;

//   if (!sessionId) {
//     return res.json({ isSuccess: false });
//   }

//   const allFilePath = path.join(resultsDir + `/${sessionId}`, 'all.json');
//   const nutFilePath = path.join(resultsDir + `/${sessionId}`, 'nut.json');

//   const allOcrFilePath = path.join(
//     resultsDir + `/${sessionId}`,
//     'all-orc.json'
//   );

//   const finalResultPath = path.join(
//     resultsDir + `/${sessionId}`,
//     'validated-output.json'
//   );

//   try {
//     const [finalData] = await Promise.all([
//       fs.readFileSync(finalResultPath, 'utf8'),
//     ]);

//     const finalRes = JSON.parse(finalData);

//     const { status } = finalRes;

//     if (status === 'validating') {
//       console.log('validating');
//       return res.status(200).send({
//         isSuccess: 'unknown',
//         status: 'validating',
//         message: 'validating data',
//       });
//     }

//     return res.json(finalRes);
//   } catch (err) {}

//   try {
//     const [allData, nutData, ocrClaimData] = await Promise.all([
//       fs.readFileSync(allFilePath, 'utf8'),
//       fs.readFileSync(nutFilePath, 'utf8'),
//       fs.readFileSync(allOcrFilePath, 'utf8'),
//     ]);

//     const allRes = JSON.parse(allData);
//     const nutRes = JSON.parse(nutData);
//     const ocrClaims = JSON.parse(ocrClaimData);

//     const { isSuccess: allSuccess, status: allStatus } = allRes || {};
//     const { isSuccess: nutSuccess, status: nutStatus } = nutRes || {};

//     if (allStatus === 'processing' || nutStatus === 'processing') {
//       return res.status(200).send({
//         isSuccess: 'unknown',
//         status: 'processing',
//         message: 'Processing images',
//       });
//     }

//     if (nutSuccess === false || allSuccess === false) {
//       return res.json({ isSuccess: false });
//     }

//     let response = {
//       product: {
//         ...allRes?.data?.jsonData,
//         factPanels: nutRes?.data?.jsonData, //* markdown converted
//         nutMark: nutRes?.data?.markdownContent,
//         allMark: allRes?.data?.markdownContent,
//       },
//     };

//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'validated-output.json',
//       JSON.stringify({
//         isSuccess: 'unknown',
//         status: 'validating',
//         message: 'Validating data',
//       })
//     );

//     res.status(200).send({
//       isSuccess: 'unknown',
//       status: 'validating',
//       message: 'validating data',
//     });

//     let validatedResponse = await responseValidator(response, ocrClaims);

//     // removeRawFieldData(validatedResponse);

//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'validated-output.json',
//       JSON.stringify({
//         isSuccess: true,
//         data: validatedResponse,
//         message: 'Successfully process image',
//       })
//     );
//   } catch (error) {
//     console.log('error', error);
//     return res
//       .status(500)
//       .json({ isSuccess: false, message: 'Something went wrong' });
//   }
// });

router.get('/get-user', async (req, res) => {
  const user = await prisma.user.findMany();
  console.log('user', user);

  return res.json({ isSuccess: true });
});

router.get('/pooling-result/:sessionId', poolingSessionResult);

router.get('/get-session-result/:sessionId', getSessionResult);

router.get('/get-history', (req, res) => {
  const historyPath = path.join(historyDir, 'history.json');

  fs.readFile(historyPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Waiting for result');
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
