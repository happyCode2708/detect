import express, { Request, Response } from 'express';
import next from 'next';
import path from 'path';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import apiRouter from './router';
import { getGenerative } from './lib/google/get-generative';
import { getGoogleApiOcr } from './lib/google/get-gg-api-ocr';
import nextBuild from 'next/dist/build';
import { nextMiddleware } from './middleware/nextMiddleware';
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

getGenerative();
getGoogleApiOcr();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
export const port = Number(process.env.PORT) || 3000;

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

const app = express();

export const baseDir = path.join(__dirname, '..');
export const uploadsDir =
  process.env.NODE_ENV !== 'production'
    ? path.join(__dirname, '..', 'assets/upload')
    : (process.env.ASSET_PATH as string);
export const resultsDir = path.join(__dirname, '..', 'assets/result');
export const historyDir = path.join(__dirname, '..', 'assets/history');
export const pythonPath = path.join(__dirname, 'python');
export const productImportDir = path.join(__dirname, '..', 'product-import');

const startServer = async () => {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/assets', express.static(uploadsDir));

  if (process.env.NEXT_BUILD) {
    app.listen(port, async () => {
      console.log('Next.js is building for production');
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'));

      process.exit();
    });

    return;
  }

  app.use('/api', apiRouter);

  app.use(
    nextMiddleware,
    async (req: Request, res: Response) => await nextHandler(req, res)
  );

  nextApp.prepare().then(() => {
    app.listen(port, async () => {
      console.log(`Next.js App running in ${env} mode on port ${port}`);
    });
  });
};

startServer();
