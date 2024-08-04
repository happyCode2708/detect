import { compareWithTDC } from '@/lib/comparator/compareWithTDC';
import { mapToTDCFormat } from '@/lib/mapper/mapToTDCFormat';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { makePostPayloadProductTDC } from '../common/utils';
import { port, prisma } from '@/server';

export const getCompareResultTdc = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ixoneid, productId } = req?.body;

  const bearerToken = process.env.IXONE_TOKEN;

  const payload = makePostPayloadProductTDC([ixoneid]);

  try {
    const productDetailRes = productId
      ? await axios.get(`http://localhost:${port}/api/product/${productId}`)
      : null;

    const productDetailData = productDetailRes?.data?.data;

    const { latestSessionId } = productDetailData;

    const newestExtractedData = await prisma.extractSession.findUnique({
      where: { sessionId: latestSessionId },
    });

    const extractResult = newestExtractedData?.result || '';

    const mappedData = mapToTDCFormat(JSON.parse(extractResult));

    const response = ixoneid
      ? await axios.post(
          'https://exchange.ix-one.net/services/products/filtered',
          payload,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
      : null;

    const foundTdcProduct = response?.data?.Products?.[0];

    const compareResult = foundTdcProduct
      ? compareWithTDC({
          tdcFormattedExtractData: mappedData,
          tdcData: foundTdcProduct,
        })
      : null;

    res.json({
      isSuccess: true,
      data: {
        compareResult,
        mappedExtractToTdc: mappedData,
        tdcData: foundTdcProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};
