import { prisma } from '@/server';
import { Request, Response, NextFunction } from 'express';

export const saveCompareResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ixoneid, compareResult } = req.body;

  try {
    //* update compare result to product
    await prisma.product.update({
      data: {
        compareResult: JSON.stringify(compareResult),
      },
      where: {
        ixoneID: ixoneid,
      },
    });
    res
      .status(201)
      .json({ isSucess: true, message: 'save compare result  successfully' });
  } catch (error) {
    next(error);
  }
};
