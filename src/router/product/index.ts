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
import { prisma } from '../../server';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { onProcessNut, onProcessOther } from '../../lib/google/gemini';

import { uploadsDir } from '../../server';
import { error } from 'console';

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
      include: { images: true },
    });

    res.status(200).json(products);
  } catch (error) {
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
      const filePath = `/assets/${file.filename}`;
      return prisma.image.create({
        data: {
          url: filePath,
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

export default router;
