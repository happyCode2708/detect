import multer from 'multer';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { createObjectCsvWriter } from 'csv-writer';

import { removeRawFieldData } from '@/lib/mapper/removeRawFieldData';
import { port, prisma, productImportDir } from '../../server';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { uploadsDir } from '../../server';

// import { makePostPayloadProductTDC } from './utils';
import axios from 'axios';
import logger from '../../lib/logger';
import { mapToTDCFormat } from '../../lib/mapper/mapToTDCFormat';
import { compareWithTDC } from '../../lib/comparator/compareWithTDC';
import { isEmpty, sample } from 'lodash';
import { responseValidator } from '../../lib/validator/main';
import { mapMdAttributeToObject } from '../../lib/mapper/mapMdAttributeToObject';
import { mapMdNutToObject } from '../../lib/mapper/mapMdNutToObject';
import _ from 'lodash';
import {
  uploadProductImages,
  createProduct,
  deleteProduct,
  saveCompareResult,
  exportCompareResult,
  getProductList,
  importProduct,
  getCompareResultTdc,
  getProductDataTdc,
  getProduct,
} from '@/router/product/handler';
import { Status } from '@prisma/client';
import { storageConfig } from './handler/storage';

const router = express.Router();

const Storage = multer.diskStorage(storageConfig);
const upload = multer({ storage: Storage });

router.post('/list', getProductList);

router.post('/create', createProduct);

router.delete('/delete-products', deleteProduct);

router.post('/save-compare-result', saveCompareResult);

router.post('/export-compare-result', exportCompareResult);

router.get('/:productId', getProduct);

// router.get('/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       include: { images: true, extractSessions: true },
//     });
//     if (!product) {
//       res.status(404).json({ message: 'Product not found', isSuccess: false });
//     }
//     if (product) {
//       product.extractSessions.sort(
//         (a: any, b: any) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//       let latestExtractSession: any = product.extractSessions?.[0] || {};
//       const { result, status } = latestExtractSession;

//       //* if the result of latest extract session is success
//       if (result && status === 'success') {
//         let latestExtractSession_result = JSON.parse(result);
//         if (process.env.NODE_ENV === 'production') {
//           removeRawFieldData(latestExtractSession_result);
//         }
//         latestExtractSession['result'] = JSON.stringify(
//           latestExtractSession_result
//         );
//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: latestExtractSession,
//           },
//         });
//       }
//       //* if result is not ready
//       const {
//         result_nut: result_nut_raw,
//         // result_all: result_all_raw,
//         result_attr_1: result_attr_1_raw,
//         result_attr_2: result_attr_2_raw,
//         sessionId,
//       } = latestExtractSession as any;
//       if (
//         !result_nut_raw ||
//         // !result_all_raw ||
//         !result_attr_1_raw ||
//         !result_attr_2_raw
//       ) {
//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: {},
//           },
//         });
//       }
//       const result_nut = JSON.parse(result_nut_raw);
//       // const result_all = JSON.parse(result_all_raw);
//       const result_attr_1 = JSON.parse(result_attr_1_raw);
//       const result_attr_2 = JSON.parse(result_attr_2_raw);

//       if (
//         isEmpty(result_nut) ||
//         // isEmpty(result_all) ||
//         isEmpty(result_attr_1) ||
//         isEmpty(result_attr_2)
//       ) {
//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: {},
//           },
//         });
//       }
//       console.log('sessionId', sessionId);
//       const nutRes = JSON.parse(result_nut?.['nut.json']);
//       // const allRes = JSON.parse(result_all?.['all.json']);
//       const attr1Res = JSON.parse(result_attr_1?.['attr_1.json']);
//       const attr2Res = JSON.parse(result_attr_2?.['attr_2.json']);
//       // const { isSuccess: allSuccess, data: allResData } = allRes || {};
//       const {
//         isSuccess: attr1Success,
//         status: attr1Status,
//         data: attr1ResData,
//       } = attr1Res || {};

//       const {
//         isSuccess: attr2Success,
//         status: attr2Status,
//         data: attr2ResData,
//       } = attr2Res || {};
//       const { isSuccess: nutSuccess, data: nutResData } = nutRes || {};

//       //* if one of process fail
//       if (
//         nutSuccess === false ||
//         // allSuccess === false ||
//         attr1Success === false ||
//         attr2Success === false
//       ) {
//         await prisma.extractSession.update({
//           where: { sessionId },
//           data: {
//             status: Status.FAIL,
//           },
//         });
//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: {},
//           },
//         });
//       }

//       const combinedMarkdownContent = `${attr1ResData?.markdownContent} \n ${attr2ResData?.markdownContent}`;

//       // console.log('JSON ===', combinedMarkdownContent);
//       //* if both process success
//       const allJsonData = mapMdAttributeToObject(
//         // allResData?.markdownContent,
//         // allResData?.extraInfo
//         combinedMarkdownContent,
//         attr1ResData?.extraInfo
//       );
//       const nutJsonData = mapMdNutToObject(nutResData?.markdownContent);

//       let finalResult = {
//         product: {
//           // ...allRes?.data?.jsonData,
//           ...allJsonData,
//           // factPanels: nutRes?.data?.jsonData, //* markdown converted
//           factPanels: nutJsonData,
//           nutMark: nutRes?.data?.markdownContent,
//           // allMark: allRes?.data?.markdownContent,
//           allMark: combinedMarkdownContent,
//         },
//       };
//       let validatedResponse = await responseValidator(finalResult, '');

//       let updatedSession = await prisma.extractSession.update({
//         where: { sessionId },
//         data: {
//           status: Status.SUCCESS,
//           result: JSON.stringify(validatedResponse),
//         },
//       });

//       let return_session = updatedSession;
//       if (updatedSession?.result) {
//         if (process.env.NODE_ENV === 'production') {
//           let return_result = JSON.parse(updatedSession?.result);
//           removeRawFieldData(return_result);
//           return_session['result'] = JSON.stringify(return_result);
//         }
//       }

//       return res.status(200).json({
//         isSuccess: true,
//         data: {
//           product,
//           latestSession: return_session,
//         },
//       });
//     }
//   } catch (error) {
//     console.log('error', error);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

router.post('/:productId/images', upload.array('images'), uploadProductImages);

router.post('/import-product', importProduct);

router.post('/get-product-data-tdc', getProductDataTdc);

router.post('/get-compare-result-tdc', getCompareResultTdc);

router.get('/ixoneId/:ixoneId', async (req, res) => {
  try {
    const { ixoneId } = req.params;
    const product = await prisma.product.findUnique({
      where: { ixoneID: ixoneId },
      include: { images: true, extractSessions: true },
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found', isSuccess: false });
    }
    if (product) {
      product.extractSessions.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      let latestExtractSession: any = product.extractSessions?.[0] || {};
      const { result, status } = latestExtractSession;

      //* if the result of latest extract session is success
      if (result && status === 'success') {
        let latestExtractSession_result = JSON.parse(result);
        if (process.env.NODE_ENV === 'production') {
          removeRawFieldData(latestExtractSession_result);
        }
        latestExtractSession['result'] = JSON.stringify(
          latestExtractSession_result
        );
        return res.status(200).json({
          isSuccess: true,
          data: {
            product,
            latestSession: latestExtractSession,
          },
        });
      }
      //* if result is not ready
      const {
        result_nut: result_nut_raw,
        result_all: result_all_raw,
        sessionId,
      } = latestExtractSession as any;
      if (!result_nut_raw || !result_all_raw) {
        return res.status(200).json({
          isSuccess: true,
          data: {
            product,
            latestSession: {},
          },
        });
      }
      const result_nut = JSON.parse(result_nut_raw);
      const result_all = JSON.parse(result_all_raw);

      if (isEmpty(result_nut) || isEmpty(result_all)) {
        return res.status(200).json({
          isSuccess: true,
          data: {
            product,
            latestSession: {},
          },
        });
      }
      console.log('sessionId', sessionId);
      const nutRes = JSON.parse(result_nut?.['nut.json']);
      const allRes = JSON.parse(result_all?.['all.json']);
      const { isSuccess: allSuccess, data: allResData } = allRes || {};
      const { isSuccess: nutSuccess, data: nutResData } = nutRes || {};

      console.log('type of', typeof allResData);

      //* if one of process fail
      if (allSuccess === false || nutSuccess === false) {
        await prisma.extractSession.update({
          where: { sessionId },
          data: {
            status: Status.SUCCESS,
          },
        });
        return res.status(200).json({
          isSuccess: true,
          data: {
            product,
            latestSession: {},
          },
        });
      }
      //* if both process success
      const allJsonData = mapMdAttributeToObject(
        allResData?.markdownContent,
        allResData?.extraInfo
      );
      const nutJsonData = mapMdNutToObject(nutResData?.markdownContent);

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

      let updatedSession = await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: Status.SUCCESS,
          result: JSON.stringify(validatedResponse),
        },
      });
      // if (updatedSession?.result && updatedSession?.status === 'success') {
      // let parsedResult = JSON.parse(updatedSession?.result);
      // if (process.env.NODE_ENV === 'production') {
      //   removeRawFieldData(parsedResult);
      // }
      return res.status(200).json({
        isSuccess: true,
        data: {
          product,
          latestSession: updatedSession,
        },
      });
      // }
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
