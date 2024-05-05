import express from 'express';
const router = express.Router();
import uploadRouter from './upload';
import factRouter from './fact';

router.use('/upload', uploadRouter);
router.use('/fact', factRouter);

export default router;
