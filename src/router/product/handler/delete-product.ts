import { prisma } from '@/server';
import { Request, Response, NextFunction } from 'express';

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ids } = req.body;

  try {
    // Delete images related to the products
    await prisma.image.deleteMany({
      where: {
        productId: {
          in: ids,
        },
      },
    });

    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    res.status(200).json({ message: 'Products deleted successfully' });
  } catch (error) {
    next(error);
  }
};
