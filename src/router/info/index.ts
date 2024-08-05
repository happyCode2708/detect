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

router.get('/get-user', async (req, res) => {
  const user = await prisma.user.findMany();
  console.log('user', user);

  return res.json({ isSuccess: true });
});

router.get('/pooling-result/:sessionId', poolingSessionResult);

router.get('/get-session-result/:sessionId', getSessionResult);

export default router;
