import { NextFunction, Request, Response } from 'express';

import { prisma } from '@/server';

import { mapMdAttributeToObject } from '@/lib/mapper/mapMdAttributeToObject';
import { mapMdNutToObject } from '@/lib/mapper/mapMdNutToObject';
import { responseValidator } from '@/lib/validator/main';
import { Status } from '@prisma/client';
import logger from '@/lib/logger';

export const revalidateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { ixoneID: req.body.ixoneId },
      include: { images: true, extractSessions: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.extractSessions.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const latestExtractSession = product.extractSessions?.[0];
    const { nutrition, attr_1, attr_2, sessionId } = latestExtractSession;

    if (nutrition === null || attr_1 === null || attr_2 === null) {
      return res.status(404).json({ error: 'Product not valid to revalidate' });
    }

    await createFinalResult({
      attr_1,
      attr_2,
      nutrition,
      sessionId,
      res,
    });

    res.status(200).json({
      isSuccess: true,
      message: 'revalidate successfully',
      data: { sessionId },
    });
  } catch (error) {
    next(error);
  }
};

const createFinalResult = async ({
  attr_1,
  attr_2,
  nutrition,
  sessionId,
  res,
}: {
  nutrition: any;
  attr_1: any;
  attr_2: any;
  sessionId: string;
  res: any;
}) => {
  if (
    [nutrition, attr_1, attr_2]?.every((value: string | null) => value === null)
  ) {
    return false;
  }

  const combinedMarkdownContent = `${attr_1} \n ${attr_2}`;

  const allJsonData = mapMdAttributeToObject(combinedMarkdownContent);
  const nutJsonData = mapMdNutToObject(nutrition);

  let finalResult = {
    product: {
      ...allJsonData,
      factPanels: nutJsonData,
      nutMark: nutrition,
      allMark: combinedMarkdownContent,
    },
  };

  let validatedResponse = await responseValidator(finalResult, '');

  const updatedSession = await prisma.extractSession.update({
    where: { sessionId },
    data: {
      status: Status.SUCCESS,
      result: JSON.stringify(validatedResponse),
    },
  });

  if (updatedSession) {
    logger.info('stored in ' + sessionId);
  }
};
