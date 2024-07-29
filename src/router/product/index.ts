import multer from 'multer';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { createObjectCsvWriter } from 'csv-writer';

import {
  getOcrTextAllImages,
  findImagesContainNutFact,
  addUniqueString,
  removeRawFieldData,
} from '../../lib/server_utils';
import { port, prisma, productImportDir } from '../../server';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { uploadsDir } from '../../server';

import { makePostPayloadProductTDC } from './utils';
import axios from 'axios';
import logger from '../../lib/logger';
import { mapToTDCformat } from '../../lib/mapper/mapToTDCFormat';
import { compareWithTDC } from '../../lib/comparator/compareWithTDC';
// import { makeSessionResult } from '@/lib/middleware/ makeSessionResult';
import { isEmpty, sample } from 'lodash';
import { responseValidator } from '../../lib/validator/main';
import { mapMarkdownAllToObject } from '../../lib/mapper/mapMdAllToObject';
import { mapMarkdownNutToObject } from '../../lib/mapper/mapMarkdonwDataToObject';
import { TDC_FIELD_OBJ } from '../../constants/tdcField';
import _ from 'lodash';
import { Pagination } from '@/components/ui/pagination';

const router = express.Router();

const Storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // Check if the directory exists, create it if not
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Directory created: c p${uploadsDir}`);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // @ts-ignore
    const { ixoneid } = req.params;

    const uniqueSuffix = Date.now();
    cb(
      null,
      'product__' +
        ixoneid +
        '__' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: Storage });

router.post('/list', async (req, res) => {
  try {
    const { search, page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await prisma.product.findMany({
      where:
        search && typeof search === 'string'
          ? {
              ixoneID: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {},
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
      skip: skip,
      take: limitNumber,
      include: { images: true },
    });

    const totalProducts = await prisma.product.count({
      where:
        search && typeof search === 'string'
          ? {
              ixoneID: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {},
    });

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      data: products,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        totalProducts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/create', async (req, res) => {
  const { ixoneID } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: ixoneID
        ? {
            ixoneID,
          }
        : {},
    });
    res.status(201).json({ data: newProduct, isSuccess: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// New delete products endpoint
router.delete('/delete-products', async (req, res) => {
  const { ids } = req.body;

  try {
    // Delete images related to the products
    await prisma.image.deleteMany({
      where: {
        productId: {
          in: ids,
        },
      },
    });

    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    res.status(200).json({ message: 'Products deleted successfully' });
  } catch (error) {
    console.log(JSON.stringify(error));
    res.status(500).json({ error: 'Failed to delete products' });
  }
});

router.post('/save-compare-result', async (req, res) => {
  const { ixoneid, compareResult } = req.body;

  try {
    //* update compare result to product
    await prisma.product.update({
      data: {
        compareResult: JSON.stringify(compareResult),
      },
      where: {
        ixoneID: ixoneid,
      },
    });
    res
      .status(201)
      .json({ isSucess: true, message: 'save compare result  successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ isSuccess: false, message: 'fail to save compare result' });
  }
});

router.post('/export-compare-result', async (req, res) => {
  const {} = req.body;

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc', // Order by creation date, newest first
    },
    // include: { images: true },
  });

  if (!products) {
    return res.status(404).json({
      isSuccess: false,
      message: 'There is no compare result to export',
    });
  }

  let exportProductsList = products
    ?.filter((item) => !!item?.compareResult)
    ?.map((productItem: any, idx: number) => {
      const compareResult = JSON.parse(productItem?.compareResult);

      let {
        SupplementPanel,
        NutritionPanel,
        generalFactPanels,
        ...restFields
      } = compareResult;

      return productItem?.compareResult
        ? {
            idx,
            ixoneId: productItem?.ixoneID,
            NutritionOrSupplementFactPanel: generalFactPanels,
            ...restFields,
            // NutritionPanel: 'NA',
            // SupplementPanel: 'NA',
            // NutritionPanel: 'produc',
            // SupplementPanel: 'NA',
            // generalFactPanels:
          }
        : [];
    });

  // Determine all unique keys across all products
  const allKeys = Array.from(
    exportProductsList.reduce((keys: Set<string>, product: any) => {
      Object.keys(product).forEach((key) => keys.add(key));
      return keys;
    }, new Set())
  );

  // Calculate the average rating
  const ratings = products
    .filter((product: any) => 'rating' in product)
    .map((product: any) => product.rating);
  const averageRating =
    ratings.reduce((sum: any, rating: any) => sum + rating, 0) / ratings.length;

  // Add average rating to the product array as a separate object
  let accuracy = {} as any;
  let sampleAmount = {} as any;

  const AVERAGE_KEY_EXCLUDED = ['idx', 'ixoneId'];

  allKeys.forEach((key: string) => {
    if (AVERAGE_KEY_EXCLUDED.includes(key)) return;

    const accuracyStatistic = computeAverage(exportProductsList, key);
    accuracy[key] = accuracyStatistic?.matchPercent;
    sampleAmount[key] = accuracyStatistic?.sampleAmount;
  });

  exportProductsList.push({
    idx: '',
    ixoneId: '',
    ...accuracy,
  });

  // Define the CSV writer

  let exportAccuracyList = allKeys
    ?.filter((key) => key !== 'idx' && key !== 'ixoneId')
    ?.map((key: string) => {
      return {
        group: TDC_FIELD_OBJ?.[key]?.DataGroup || 'N/A',
        fieldName: key,
        matchPercent: accuracy[key]?.toFixed(2),
        sampleAmount: sampleAmount[key],
      };
    });

  let exportAccuracyListHeader = [
    {
      id: 'group',
      title: 'Group',
    },
    {
      id: 'fieldName',
      title: 'Field Name',
    },
    {
      id: 'matchPercent',
      title: 'Match Percent',
    },
    {
      id: 'sampleAmount',
      title: `Sample Amount in 251 products`,
    },
  ];

  const sortedAccuracyList = _.sortBy(exportAccuracyList, ['group']);

  try {
    //* export all product
    const csvWriter = createObjectCsvWriter({
      path: 'products-com-2.csv',
      header: allKeys.map((key: any) => ({ id: key, title: key })),
    });

    // Write the products to the CSV file
    csvWriter
      .writeRecords(exportProductsList)
      .then(() => {
        console.log('CSV file was written successfully');

        res.status(201).json({
          isSucess: true,
          message: 'export compare result  successfully',
        });
      })
      .catch((err: any) => {
        console.error('Error writing CSV file:', err);
      });

    //* export accuracy list

    const csvWriter2 = createObjectCsvWriter({
      path: 'accuracy_list_251_products.csv',
      header: exportAccuracyListHeader,
    });

    // Write the products to the CSV file
    csvWriter2
      .writeRecords(sortedAccuracyList)
      .then(() => {
        console.log('CSV file was written successfully');

        // res.status(201).json({
        //   isSucess: true,
        //   message: 'export compare result  successfully',
        // });
      })
      .catch((err: any) => {
        console.error('Error writing CSV file:', err);
      });
  } catch (error) {
    res
      .status(500)
      .json({ isSucess: false, message: 'fail to export compare result' });
  }
});

const computeAverage = (products: any, field: string) => {
  const allPercents = products
    .filter(
      (product: any) =>
        field in product &&
        product[field] !== '' &&
        product[field] !== 'NA' &&
        product[field] !== undefined
    )
    .map((product: any) => product?.[field]);
  const averagePercent =
    allPercents.reduce((sum: any, percentValue: any) => {
      if (field === 'NutritionOrSupplementFactPanel') {
        console.log('value', percentValue);
      }
      return sum + (percentValue === 'NaN' ? 0 : Number(percentValue));
    }, 0) / allPercents.length;

  // console.log('allpercents', JSON.stringify(allPercents));

  // const final = averagePercent;
  return {
    matchPercent: averagePercent,
    sampleAmount: allPercents.length,
  };
};

// router.post('/create-session', async (req, res) => {
//   const { ixoneId, session } = req.body;

//   try {
//     const product = await prisma.product.findUnique({
//       where: { ixoneID: ixoneId },
//       include: { images: true },
//     });

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const newSession = await prisma.extractSession.create({
//       data: {
//         productId: product?.productId,
//         status: 'done',
//         // folderPath: '/assets/'+ sessionm
//       },
//     });
//     res.status(201).json(newSession);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
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
      let latestExtractSession = product.extractSessions?.[0] || {};
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
        // result_all: result_all_raw,
        result_attr_1: result_attr_1_raw,
        result_attr_2: result_attr_2_raw,
        sessionId,
      } = latestExtractSession as any;
      if (
        !result_nut_raw ||
        // !result_all_raw ||
        !result_attr_1_raw ||
        !result_attr_2_raw
      ) {
        return res.status(200).json({
          isSuccess: true,
          data: {
            product,
            latestSession: {},
          },
        });
      }
      const result_nut = JSON.parse(result_nut_raw);
      // const result_all = JSON.parse(result_all_raw);
      const result_attr_1 = JSON.parse(result_attr_1_raw);
      const result_attr_2 = JSON.parse(result_attr_2_raw);

      if (
        isEmpty(result_nut) ||
        // isEmpty(result_all) ||
        isEmpty(result_attr_1) ||
        isEmpty(result_attr_2)
      ) {
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
      // const allRes = JSON.parse(result_all?.['all.json']);
      const attr1Res = JSON.parse(result_attr_1?.['attr_1.json']);
      const attr2Res = JSON.parse(result_attr_2?.['attr_2.json']);
      // const { isSuccess: allSuccess, data: allResData } = allRes || {};
      const {
        isSuccess: attr1Success,
        status: attr1Status,
        data: attr1ResData,
      } = attr1Res || {};

      const {
        isSuccess: attr2Success,
        status: attr2Status,
        data: attr2ResData,
      } = attr2Res || {};
      const { isSuccess: nutSuccess, data: nutResData } = nutRes || {};

      //* if one of process fail
      if (
        nutSuccess === false ||
        // allSuccess === false ||
        attr1Success === false ||
        attr2Success === false
      ) {
        await prisma.extractSession.update({
          where: { sessionId },
          data: {
            status: 'fail',
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

      const combinedMarkdownContent = `${attr1ResData?.markdownContent} \n ${attr2ResData?.markdownContent}`;

      console.log('JSON ===', combinedMarkdownContent);
      //* if both process success
      const allJsonData = mapMarkdownAllToObject(
        // allResData?.markdownContent,
        // allResData?.extraInfo
        combinedMarkdownContent,
        attr1ResData?.extraInfo
      );
      const nutJsonData = mapMarkdownNutToObject(nutResData?.markdownContent);

      let finalResult = {
        product: {
          // ...allRes?.data?.jsonData,
          ...allJsonData,
          // factPanels: nutRes?.data?.jsonData, //* markdown converted
          factPanels: nutJsonData,
          nutMark: nutRes?.data?.markdownContent,
          // allMark: allRes?.data?.markdownContent,
          allMark: combinedMarkdownContent,
        },
      };
      let validatedResponse = await responseValidator(finalResult, '');

      let updatedSession = await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: 'success',
          result: JSON.stringify(validatedResponse),
        },
      });

      let return_session = updatedSession;
      if (updatedSession?.result) {
        if (process.env.NODE_ENV === 'production') {
          let return_result = JSON.parse(updatedSession?.result);
          removeRawFieldData(return_result);
          return_session['result'] = JSON.stringify(return_result);
        }
      }

      return res.status(200).json({
        isSuccess: true,
        data: {
          product,
          latestSession: return_session,
        },
      });
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/:productId/images', upload.array('images'), async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete old images
    await prisma.image.deleteMany({
      where: {
        productId: product.id,
      },
    });

    // Optionally, delete files from the filesystem (uncomment if needed)
    // product.images.forEach(image => {
    //   const filePath = path.join(__dirname, image.url);
    //   fs.unlinkSync(filePath);
    // });

    const files = req.files as Express.Multer.File[];

    const imagePromises = files.map((file) => {
      const imageUrl = `/assets/${file.filename}`;
      const path = `${uploadsDir}/${file.filename}`;

      console.log('path', path);

      return prisma.image.create({
        data: {
          url: imageUrl,
          path,
          productId: product.id,
        },
      });
    });

    await Promise.all(imagePromises);

    res
      .status(200)
      .json({ isSuccess: true, message: 'Images uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

router.post('/import-product', async (req, res) => {
  try {
    const folderNames = fs
      .readdirSync(productImportDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const folderName of folderNames) {
      let product = await prisma.product.findUnique({
        where: { ixoneID: folderName },
      });

      if (!product) {
        // Create a new product if it doesn't exist
        let createdProduct = await prisma.product.create({
          data: {
            ixoneID: folderName,
          },
        });
        console.log(`Created new product with ixoneID ${folderName}`);

        const imageFiles = fs.readdirSync(
          path.join(productImportDir, folderName)
        );

        const imagePromises = imageFiles.map((file) => {
          const filePath = path.join(productImportDir, folderName, file);
          const uniqueSuffix = Date.now();
          const newFileName = `product__${folderName}__${uniqueSuffix}${path.extname(
            file
          )}`;

          const newFilePath = path.join(uploadsDir, newFileName);
          fs.copyFileSync(filePath, newFilePath);
          // console.log('copy', `}`

          const imageUrl = `/assets/${newFileName}`;

          console.log('New path', path);

          return prisma.image.create({
            data: {
              url: imageUrl,
              path: newFilePath,
              productId: createdProduct.id,
            },
          });
        });

        await Promise.all(imagePromises);
      } else {
        console.log(
          `Product with ixoneID ${folderName} already exists, skipping...`
        );
      }
    }

    res
      .status(200)
      .json({ isSuccess: true, message: 'All images uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

router.post('/get-product-data-tdc', async (req, res) => {
  const ixoneIDs = req.body.ixoneIDs || [];
  const bearerToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6ImNBRUFBQUZ3QVkvK1ZLWUFublNvVjVlbXp5VWgxQlhPWUlZS1czOVJ2SFBqanhmTENscDhCNDNvenJNaWI2ZjdHMEMwemovdjN1cUg0MFlpUEQvSE9mSy93ckJhYmlFSHh4MkFPWnozVlBuQW9iVlExUDdJZ1ZBM2ZHVnpFcjV0QlpxbFZBeG5jWkpiZ1FSTEZGbzlyQ0IzUTdPWERZQ0lIWTNreFlyTkJ2cVM1TjUvN3d1dWlrNGJtV3FXdnVZdlBaL1VGazExWFU4a2dTdkxFdXpPMnJnQWEwNGpvaUo5UUJTTWNoa0ZibWwva0tHWG5QdXlVUW5DUVJiYXJNTFBUdGlJdkFmMzJWUkMwQ21nN1FUcDhGTHFrVjQrRWN0N3pmWExlUlNwQ1lCMVFZcTh3VExRa1ZwMFREVGZSN2xXUm8xOE94ajhkYnAvK0tKU2svNDVJMlkwbXFkbGlidkQyTDlhSjM1ZkJna0NkTEhhc3V2Z2x0bWkwSk1ubnhLL3prZUxhemlQbUNpVVJ4NjYwNUlWQVNKaTFSbzVPWU5iOXZIRVphSW84elV2OUpSKzM5SFVLanI0SU1BWFg1YlB0TVR5cFFYYW0rd0NHY2NlT1hYUlMySFN4M3RMSUVJU0xseUplS3B5SGNFTzNZVXY3aWUyMkFrPSIsIm5iZiI6MTcxOTgyMzU3OSwiZXhwIjoxNzUxMzU5NTc5LCJpYXQiOjE3MTk4MjM1Nzl9.NxaCMTHIuWB2GJHVSgHhNjFVg95EHaWtZkK2XJxVbdc';

  const payload = makePostPayloadProductTDC(ixoneIDs);

  try {
    const response = await axios.post(
      'https://exchange.ix-one.net/services/products/filtered',
      payload,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      isSuccess: true,
      data: response?.data,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Failed to get products TDC' });
  }
});

router.post('/get-compare-result-tdc', async (req, res) => {
  const { ixoneid, productId } = req?.body;

  // if (!ixoneid) {
  //   res.status(404).json({ isSuccess: false, message: 'Ixoneid is required' });
  // }

  const bearerToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6ImNBRUFBQUZ3QVkvK1ZLWUFublNvVjVlbXp5VWgxQlhPWUlZS1czOVJ2SFBqanhmTENscDhCNDNvenJNaWI2ZjdHMEMwemovdjN1cUg0MFlpUEQvSE9mSy93ckJhYmlFSHh4MkFPWnozVlBuQW9iVlExUDdJZ1ZBM2ZHVnpFcjV0QlpxbFZBeG5jWkpiZ1FSTEZGbzlyQ0IzUTdPWERZQ0lIWTNreFlyTkJ2cVM1TjUvN3d1dWlrNGJtV3FXdnVZdlBaL1VGazExWFU4a2dTdkxFdXpPMnJnQWEwNGpvaUo5UUJTTWNoa0ZibWwva0tHWG5QdXlVUW5DUVJiYXJNTFBUdGlJdkFmMzJWUkMwQ21nN1FUcDhGTHFrVjQrRWN0N3pmWExlUlNwQ1lCMVFZcTh3VExRa1ZwMFREVGZSN2xXUm8xOE94ajhkYnAvK0tKU2svNDVJMlkwbXFkbGlidkQyTDlhSjM1ZkJna0NkTEhhc3V2Z2x0bWkwSk1ubnhLL3prZUxhemlQbUNpVVJ4NjYwNUlWQVNKaTFSbzVPWU5iOXZIRVphSW84elV2OUpSKzM5SFVLanI0SU1BWFg1YlB0TVR5cFFYYW0rd0NHY2NlT1hYUlMySFN4M3RMSUVJU0xseUplS3B5SGNFTzNZVXY3aWUyMkFrPSIsIm5iZiI6MTcxOTgyMzU3OSwiZXhwIjoxNzUxMzU5NTc5LCJpYXQiOjE3MTk4MjM1Nzl9.NxaCMTHIuWB2GJHVSgHhNjFVg95EHaWtZkK2XJxVbdc';

  const payload = makePostPayloadProductTDC([ixoneid]);

  try {
    const productDetailRes = ixoneid
      ? await axios.get(
          `http://localhost:${port}/api/product/ixoneId/${ixoneid}`
        )
      : productId
      ? await axios.get(`http://localhost:${port}/api/product/${productId}`)
      : null;

    const productDetailData = productDetailRes?.data?.data;

    const newestExtractedData = productDetailData?.latestSession;

    const mappedData = mapToTDCformat(JSON.parse(newestExtractedData?.result));

    const response = ixoneid
      ? await axios.post(
          'https://exchange.ix-one.net/services/products/filtered',
          payload,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
      : null;

    const foundTdcProduct = response?.data?.Products?.[0];

    // if (!foundTdcProduct) {
    //   return res
    //     .status(404)
    //     .json({ isSuccess: false, message: 'Product not found' });
    // }

    const compareResult = foundTdcProduct
      ? compareWithTDC({
          tdcFormattedExtractData: mappedData,
          tdcData: foundTdcProduct,
        })
      : null;

    res.json({
      isSuccess: true,
      data: {
        compareResult,
        mappedExtractToTdc: mappedData,
        tdcData: foundTdcProduct,
      },
    });
  } catch (error) {
    // logger.error(error);
    console.log(error);
    res.status(500).json({ error: 'Failed to compare with TDC data' });
  }
});

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
      let latestExtractSession = product.extractSessions?.[0] || {};
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
            status: 'fail',
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

      let updatedSession = await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: 'success',
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
