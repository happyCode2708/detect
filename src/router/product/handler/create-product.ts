import { prisma } from '@/server';
import { Request, Response, NextFunction } from 'express';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ixoneID } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: ixoneID
        ? {
            ixoneID,
          }
        : {},
    });
    res.status(201).json({ data: newProduct, isSuccess: true });
  } catch (error) {
    next(error);
  }
};
