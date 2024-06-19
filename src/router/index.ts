import express from 'express';
const router = express.Router();
import uploadRouter from './upload';
import factRouter from './info';

router.use('/upload', uploadRouter);
router.use('/info', factRouter);

export default router;
