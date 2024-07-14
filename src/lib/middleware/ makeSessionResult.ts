import { prisma } from "@/server";

export const makeSessionResult = (req: any, res: any, next: any) => {
  try {
    const sessionId = req.params.sessionId;

    let session = await prisma.extractSession.findUnique({
      where: { sessionId },
      // include: { product: true },  // Include related product details if needed
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
    }
    const { result_nut: result_nut_raw, result_all: result_all_raw } = session as any;

    if (session?.status === 'unknown' && (!result_nut_raw || !result_all_raw)) {
      return res.status(200).send({
        isSuccess: 'unknown',
        status: 'processing',
        message: 'The result is not ready',
      });
    }

    const result_nut = JSON.parse(result_nut_raw);
    const result_all = JSON.parse(result_all_raw);

    const nutRes = JSON.parse(result_nut?.['nut.json']);
    const allRes = JSON.parse(result_all?.['all.json']);

    console.log(typeof nutRes);

    const { isSuccess: allSuccess, status: allStatus } = allRes || {};
    const { isSuccess: nutSuccess, status: nutStatus } = nutRes || {};

    if (nutSuccess === false || allSuccess === false) {
      session = await prisma.extractSession.update({
        where: { sessionId },
        data: {
          status: 'fail',
        },
      });
      return res.status(404).send({
        isSuccess: false,
        status: 'fail',
        message: 'something went wrong',
      });
    }

    let finalResult = {
      product: {
        ...allRes?.data?.jsonData,
        factPanels: nutRes?.data?.jsonData, //* markdown converted
        nutMark: nutRes?.data?.markdownContent,
        allMark: allRes?.data?.markdownContent,
      },
    };

    let validatedResponse = await responseValidator(finalResult, '');

    session = await prisma.extractSession.update({
      where: { sessionId },
      data: {
        status: 'success',
        result: JSON.stringify(validatedResponse),
      },
    });

    const result = session?.result;

    if (!result && session?.status === 'fail') {
      return res.status(404).send({
        isSuccess: false,
        status: 'fail',
        message: 'something went wrong',
      });
    }

    if (result && session?.status === 'success') {
      let parsedResult = JSON.parse(result);
      if (process.env.NODE_ENV === 'production') {
        removeRawFieldData(parsedResult);
      }

      return res.status(200).json({
        isSuccess: true,
        data: parsedResult,
        message: 'Successfully process image',
      });
    }
}