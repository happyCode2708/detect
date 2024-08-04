// errorHandler.ts
import logger from '@/lib/logger';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('err', err);
  const message = err?.message;

  logger.error(JSON.stringify(err));

  res
    .status(500)
    .json({ isSuccess: false, message: message || 'Server Error' });
};

export default errorHandler;
