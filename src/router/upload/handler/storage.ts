import { uploadsDir } from '@/server';
import fs from 'fs';
import { Request } from 'express';
import path from 'path';

export const storageConfig = {
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    // Check if the directory exists, create it if not
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Directory created: c p${uploadsDir}`);
    }
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    // @ts-ignore
    const sessionId = req?.customData?.sessionId ?? '';

    const uniqueSuffix = Date.now();
    cb(
      null,
      (sessionId ? `${sessionId}` : '') +
        '__' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
};
