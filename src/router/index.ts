import express from 'express';
const router = express.Router();
import uploadRouter from './upload';
import factRouter from './info';
import authRouter from './auth';
import productRouter from './product';

router.use('/upload', uploadRouter);
router.use('/info', factRouter);
router.use('/auth', authRouter);
router.use('/product', productRouter);

export default router;
