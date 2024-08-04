import { prisma } from '@/server';
import { Request, Response, NextFunction } from 'express';

export const getProductList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await prisma.product.findMany({
      where:
        search && typeof search === 'string'
          ? {
              ixoneID: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {},
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
      skip: skip,
      take: limitNumber,
      include: { images: true },
    });

    const totalProducts = await prisma.product.count({
      where:
        search && typeof search === 'string'
          ? {
              ixoneID: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {},
    });

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      data: products,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        totalProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
