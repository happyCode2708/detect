import { Request, Response, NextFunction } from 'express';
import { makePostPayloadProductTDC } from '../common/utils';
import axios from 'axios';

export const getProductDataTdc = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ixoneIDs = req.body.ixoneIDs || [];
  const bearerToken = process.env.IXONE_TOKEN;

  const payload = makePostPayloadProductTDC(ixoneIDs);

  try {
    const response = await axios.post(
      'https://exchange.ix-one.net/services/products/filtered',
      payload,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      isSuccess: true,
      data: response?.data,
    });
  } catch (error) {
    next(error);
  }
};
