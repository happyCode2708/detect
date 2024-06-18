import express from 'express';
import next from 'next';
import path from 'path';

import apiRouter from './router';
import { getGenerative } from './utils/get-generative';
import { getGoogleApiOcr } from './utils/get-gg-api-ocr';
import nextBuild from 'next/dist/build';

require('dotenv').config();

getGenerative();
getGoogleApiOcr();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = Number(process.env.PORT) || 3000;

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

const app = express();

export const uploadsDir = path.join(__dirname, 'data/uploads');
export const resultsDir = path.join(__dirname, 'data/results');
export const historyDir = path.join(__dirname, 'data/history');
export const pythonPath = path.join(__dirname, 'python');

const startServer = async () => {
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

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    app.listen(port, async () => {
      console.log(`Next.js App running on port ${port}`);
    });
  });
};

startServer();
