import multer from 'multer';
import express from 'express';

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

router.post('/:productId/images', upload.array('images'), uploadProductImages);

router.post('/import-product', importProduct);

router.post('/get-product-data-tdc', getProductDataTdc);

router.post('/get-compare-result-tdc', getCompareResultTdc);

export default router;
