import { mapMdAttributeToObject } from '@/lib/mapper/mapMdAttributeToObject';
import { mapMdNutToObject } from '@/lib/mapper/mapMdNutToObject';
import { removeRawFieldData } from '@/lib/mapper/removeRawFieldData';
import { responseValidator } from '@/lib/validator/main';
import { prisma } from '@/server';
import { Status } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, extractSessions: true },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found', isSuccess: false });
    }

    if (product) {
      product.extractSessions.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      let latestExtractSession = product.extractSessions?.[0];

      return res.status(200).json({
        isSuccess: true,
        data: {
          product,
          latestSessionId: latestExtractSession?.sessionId,
        },
      });
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// export const getProductWithLatestSesison = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { productId } = req.params;

//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       include: { images: true, extractSessions: true },
//     });

//     if (!product) {
//       res.status(404).json({ message: 'Product not found', isSuccess: false });
//     }

//     if (product) {
//       product.extractSessions.sort(
//         (a: any, b: any) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );

//       let latestExtractSession = product.extractSessions?.[0];

//       const { result, status, attr_1, attr_2, nutrition, sessionId } =
//         latestExtractSession;

//       //* if the result of latest extract session is success
//       if (result && status === Status.SUCCESS) {
//         let latestExtractSession_result = JSON.parse(result);

//         if (process.env.NODE_ENV === 'production') {
//           removeRawFieldData(latestExtractSession_result);
//         }

//         latestExtractSession['result'] = JSON.stringify(
//           latestExtractSession_result
//         );

//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: latestExtractSession,
//           },
//         });
//       }

//       //* if status fail => image processing failed
//       if (status === Status.FAIL) {
//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: {
//               status,
//               sessionId,
//             },
//           },
//         });
//       }

//       //* if status unknonw => process is on-going
//       if (
//         status === Status.UNKNOWN &&
//         (nutrition === null || attr_1 === null || attr_2 === null)
//       ) {
//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: {
//               status,
//               sessionId,
//             },
//           },
//         });
//       }

//       const combinedMarkdownContent = `${attr_1} \n ${attr_2}`;

//       //* if both process success
//       const allJsonData = mapMdAttributeToObject(combinedMarkdownContent);
//       const nutJsonData = mapMdNutToObject(nutrition as string);

//       let finalResult = {
//         product: {
//           ...allJsonData,
//           factPanels: nutJsonData,
//           nutMark: nutrition,
//           allMark: combinedMarkdownContent,
//         },
//       };

//       let validatedResponse = await responseValidator(finalResult, '');

//       let updatedSession = await prisma.extractSession.update({
//         where: { sessionId },
//         data: {
//           status: Status.SUCCESS,
//           result: JSON.stringify(validatedResponse),
//         },
//       });

//       if (
//         updatedSession?.status === Status.SUCCESS &&
//         updatedSession?.result !== null
//       ) {
//         let return_session = updatedSession;

//         if (process.env.NODE_ENV === 'production') {
//           let parsedResult = JSON.parse(updatedSession?.result);

//           removeRawFieldData(parsedResult);
//           return_session['result'] = JSON.stringify(parsedResult);
//         }

//         return res.status(200).json({
//           isSuccess: true,
//           data: {
//             product,
//             latestSession: return_session,
//           },
//         });
//       }
//     }
//   } catch (error) {
//     console.log('error', error);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// };
