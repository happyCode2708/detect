import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir, prisma } from '../../server';
import path from 'path';
import { writeJsonToFile } from '../../lib/json';
import { responseValidator } from '../../lib/validator/main';
import { removeRawFieldData } from '../../lib/server_utils';
import { mapMarkdownAllToObject } from '../../lib/mapper/mapMdAllToObject';
import { mapMarkdownNutToObject } from '../../lib/mapper/mapMarkdonwDataToObject';

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

router.get('/pooling-result/:sessionId', async (req, res) => {
  // Validate that the file extension is .json
  try {
    const sessionId = req.params.sessionId;

    let session = await prisma.extractSession.findUnique({
      where: { sessionId },
      // include: { product: true },  // Include related product details if needed
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
    }
    const { result_nut: result_nut_raw, result_all: result_all_raw } =
      session as any;

    if (session?.status === 'unknown' && (!result_nut_raw || !result_all_raw)) {
      return res.status(200).send({
        isSuccess: 'unknown',
        status: 'processing',
        message: 'The result is not ready',
      });
    }

    if (session?.status === 'fail') {
      return res.status(404).send({
        isSuccess: false,
        status: 'fail',
        message: 'something went wrong',
      });
    }

    const result_nut = JSON.parse(result_nut_raw);
    const result_all = JSON.parse(result_all_raw);

    const nutRes = JSON.parse(result_nut?.['nut.json']);
    const allRes = JSON.parse(result_all?.['all.json']);

    console.log(typeof nutRes);

    const {
      isSuccess: allSuccess,
      status: allStatus,
      data: allResData,
    } = allRes || {};

    const {
      isSuccess: nutSuccess,
      status: nutStatus,
      data: nutResData,
    } = nutRes || {};

    if (nutSuccess === false || allSuccess === false) {
      session = await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: 'fail',
        },
      });
      return res.status(404).send({
        isSuccess: false,
        status: 'fail',
        message: 'something went wrong',
      });
    }

    const allJsonData = mapMarkdownAllToObject(
      allResData?.markdownContent,
      allResData?.extraInfo
    );
    const nutJsonData = mapMarkdownNutToObject(nutResData?.markdownContent);

    let finalResult = {
      product: {
        // ...allRes?.data?.jsonData,
        ...allJsonData,
        // factPanels: nutRes?.data?.jsonData, //* markdown converted
        factPanels: nutJsonData,
        nutMark: nutRes?.data?.markdownContent,
        allMark: allRes?.data?.markdownContent,
      },
    };

    let validatedResponse = await responseValidator(finalResult, '');

    session = await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'success',
        result: JSON.stringify(validatedResponse),
      },
    });

    const result = session?.result;

    if (!result && session?.status === 'fail') {
      return res.status(404).send({
        isSuccess: false,
        status: 'fail',
        message: 'something went wrong',
      });
    }

    if (result && session?.status === 'success') {
      let parsedResult = JSON.parse(result);
      if (process.env.NODE_ENV === 'production') {
        removeRawFieldData(parsedResult);
      }

      return res.status(200).json({
        isSuccess: true,
        data: parsedResult,
        message: 'Successfully process image',
      });
    }
  } catch (error) {
    console.log('e', error);
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

// router.get('/get-result/:sessionId', async (req, res) => {
//   // Validate that the file extension is .json
//   const sessionId = req.params.sessionId;

//   if (!sessionId) {
//     return res.json({ isSuccess: false });
//   }

//   return;

//   const allFilePath = path.join(
//     resultsDir + `/${sessionId}`,
//     'all-' + sessionId + '.json'
//   );
//   const nutFilePath = path.join(
//     resultsDir + `/${sessionId}`,
//     'nut-' + sessionId + '.json'
//   );

//   const allOcrFilePath = path.join(
//     resultsDir + `/${sessionId}`,
//     'all-orc-' + sessionId + '.json'
//   );

//   const finalResultPath = path.join(
//     resultsDir + `/${sessionId}`,
//     'validated-output-' + sessionId + '.json'
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
//       ...allRes.data,
//       ...nutRes.data,
//       validatorAndFixBug: {
//         ...allRes.data.validatorAndFixBug,
//         ...nutRes.data.validatorAndFixBug,
//       },
//       product: {
//         ...allRes.data.product,
//         factPanels: nutRes.data.product.factPanels,
//       },
//     };

//     writeJsonToFile(
//       resultsDir + `/${sessionId}`,
//       'validated-output-' + sessionId + '.json',
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
//       'validated-output-' + sessionId + '.json',
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
