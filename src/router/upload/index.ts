import multer from 'multer';
import express from 'express';

import { processProductImage } from './handler/process-product-image';
import { revalidateProduct } from './handler/revalidate-product';
import { storageConfig } from './handler/storage';

const router = express.Router();

const Storage = multer.diskStorage(storageConfig);

const upload = multer({ storage: Storage });

router.post('/process-product-image', processProductImage);

router.post('/revalidate-product-data', revalidateProduct);

export default router;
