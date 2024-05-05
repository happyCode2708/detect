import express from 'express';
import next from 'next';
import multer, { Multer } from 'multer';
import path from 'path';
// import OpenAI from 'openai';

import apiRouter from './router';
import { getGenerative } from './utils/get-generative';

require('dotenv').config();

getGenerative();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

const app = express();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const uploadsDir = path.join(__dirname, 'data/uploads');
export const resultsDir = path.join(__dirname, 'data/results');
export const historyDir = path.join(__dirname, 'data/history');
export const pythonPath = path.join(__dirname, 'python');

app.use('/api', apiRouter);

app.use((req, res) => nextHandler(req, res));

nextApp.prepare().then(() => {
  app.listen(port, async () => {
    console.log(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
  });
});
