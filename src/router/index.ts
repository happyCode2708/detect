import express from 'express';
const router = express.Router();
import uploadRouter from './upload';
import factRouter from './info';
import authRouter from './auth';

router.use('/upload', uploadRouter);
router.use('/info', factRouter);
router.use('/auth', authRouter);

export default router;
