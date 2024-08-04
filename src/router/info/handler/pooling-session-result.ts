import { mapMdAttributeToObject } from '@/lib/mapper/mapMdAttributeToObject';
import { mapMdNutToObject } from '@/lib/mapper/mapMdNutToObject';
import { removeRawFieldData } from '@/lib/mapper/removeRawFieldData';
import { responseValidator } from '@/lib/validator/main';
import { prisma } from '@/server';
import { Status } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export const poolingSessionResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.params.sessionId;

    let session = await prisma.extractSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { nutrition, attr_1, attr_2, status } = session;

    //* if status fail => image processing failed=> p
    if (status === Status.FAIL) {
      return res.status(404).send({
        isSuccess: false,
        data: {
          status,
          sessionId,
        },
        message: 'something went wrong',
      });
    }

    //* if one value = null it mean image processing is on-going
    if (
      status === Status.UNKNOWN &&
      (nutrition === null || attr_1 === null || attr_2 === null)
    ) {
      return res.status(200).send({
        isSuccess: false,
        data: {
          status,
          sessionId,
        },
        message: 'The result is not ready',
      });
    }

    const combinedMarkdownContent = `${attr_1} \n ${attr_2}`;

    const allJsonData = mapMdAttributeToObject(
      combinedMarkdownContent
      // attr1ResData?.extraInfo
    );

    const nutJsonData = mapMdNutToObject(nutrition as string);

    let finalResult = {
      product: {
        ...allJsonData,
        factPanels: nutJsonData,
        nutMark: nutrition,
        allMark: combinedMarkdownContent,
      },
    };

    let validatedResponse = await responseValidator(finalResult, '');

    session = await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: Status.SUCCESS,
        result: JSON.stringify(validatedResponse),
      },
    });

    // const extraInfo = attr1ResData?.extraInfo;
    // const upc12 = extraInfo?.physical?.upc12;

    // if (upc12) {
    //   await prisma.product.update({
    //     where: {
    //       id: session?.productId,
    //     },
    //     data: {
    //       upc12: upc12 as string,
    //     },
    //   });
    // }

    if (session?.status === Status.SUCCESS && session?.result !== null) {
      let parsedResult = JSON.parse(session?.result);
      if (process.env.NODE_ENV === 'production') {
        removeRawFieldData(parsedResult);
      }

      return res.status(200).json({
        isSuccess: true,
        data: {
          status,
          sessionId,
          sessionResult: parsedResult,
        },
        parsedResult,
        message: 'Successfully process image',
      });
    }
  } catch (error) {
    next(error);
  }
};
