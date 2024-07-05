import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import express from 'express';

import {
  getOcrTextAllImages,
  findImagesContainNutFact,
  addUniqueString,
} from '../../lib/server_utils';
import { port, prisma } from '../../server';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { onProcessNut, onProcessOther } from '../../lib/google/gemini';

import { uploadsDir } from '../../server';
import { error } from 'console';
import { makePostPayloadProductTDC } from './utils';
import axios from 'axios';
import logger from '../../lib/logger';
import { mapToTDCformat } from '../../lib/mapper/mapToTDCFormat';
import { compareWithTDC } from '../../lib/comparator/compareWithTDC';

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
    const { ixoneID } = req.query;

    const products = await prisma.product.findMany({
      where:
        ixoneID && typeof ixoneID === 'string'
          ? {
              ixoneID: {
                contains: ixoneID,
                mode: 'insensitive',
              },
            }
          : {},
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
      include: { images: true },
    });

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/create', async (req, res) => {
  const { ixoneID } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        ixoneID,
      },
    });
    res.status(201).json(newProduct);
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

router.get('/:ixoneid', async (req, res) => {
  const { ixoneid } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { ixoneID: ixoneid },
      include: { images: true, extractSessions: true },
    });
    if (product) {
      product.extractSessions.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.status(200).json({ isSuccess: true, data: product });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/:ixoneid/images', upload.array('images'), async (req, res) => {
  const { ixoneid } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { ixoneID: ixoneid },
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
      const path = `/assets/upload/${file.filename}`;
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
  const ixoneid = req.body.ixoneid;

  if (!ixoneid) {
    res.status(404).json({ isSuccess: false, message: 'Ixoneid is required' });
  }

  const bearerToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6ImNBRUFBQUZ3QVkvK1ZLWUFublNvVjVlbXp5VWgxQlhPWUlZS1czOVJ2SFBqanhmTENscDhCNDNvenJNaWI2ZjdHMEMwemovdjN1cUg0MFlpUEQvSE9mSy93ckJhYmlFSHh4MkFPWnozVlBuQW9iVlExUDdJZ1ZBM2ZHVnpFcjV0QlpxbFZBeG5jWkpiZ1FSTEZGbzlyQ0IzUTdPWERZQ0lIWTNreFlyTkJ2cVM1TjUvN3d1dWlrNGJtV3FXdnVZdlBaL1VGazExWFU4a2dTdkxFdXpPMnJnQWEwNGpvaUo5UUJTTWNoa0ZibWwva0tHWG5QdXlVUW5DUVJiYXJNTFBUdGlJdkFmMzJWUkMwQ21nN1FUcDhGTHFrVjQrRWN0N3pmWExlUlNwQ1lCMVFZcTh3VExRa1ZwMFREVGZSN2xXUm8xOE94ajhkYnAvK0tKU2svNDVJMlkwbXFkbGlidkQyTDlhSjM1ZkJna0NkTEhhc3V2Z2x0bWkwSk1ubnhLL3prZUxhemlQbUNpVVJ4NjYwNUlWQVNKaTFSbzVPWU5iOXZIRVphSW84elV2OUpSKzM5SFVLanI0SU1BWFg1YlB0TVR5cFFYYW0rd0NHY2NlT1hYUlMySFN4M3RMSUVJU0xseUplS3B5SGNFTzNZVXY3aWUyMkFrPSIsIm5iZiI6MTcxOTgyMzU3OSwiZXhwIjoxNzUxMzU5NTc5LCJpYXQiOjE3MTk4MjM1Nzl9.NxaCMTHIuWB2GJHVSgHhNjFVg95EHaWtZkK2XJxVbdc';

  const payload = makePostPayloadProductTDC([ixoneid]);

  try {
    const productDetailRes = await axios.get(
      `http://localhost:${port}/api/product/${ixoneid}`
    );

    const productDetailData = productDetailRes?.data?.data;

    const newestExtractedData = productDetailData?.extractSessions?.[0];

    const mappedData = mapToTDCformat(JSON.parse(newestExtractedData?.result));

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

    const foundTdcProduct = response?.data?.Products?.[0];

    if (!foundTdcProduct) {
      res.status(404).json({ isSuccess: false, message: 'Product not found' });
    }

    const compareResult = compareWithTDC({
      tdcFormattedExtractData: mappedData,
      tdcData: foundTdcProduct,
    });

    res.json({
      isSuccess: true,
      data: {
        compareResult,
        mappedExtractToTdc: mappedData,
      },
    });
  } catch (error) {
    // logger.error(error);
    console.log(error);
    res.status(500).json({ error: 'Failed to compare with TDC data' });
  }
});

export default router;
