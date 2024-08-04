import { prisma } from '@/server';
import { Request, Response, NextFunction } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import { TDC_FIELD_OBJ } from '@/constants/tdcField';
import { sortBy } from 'lodash';

export const exportCompareResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
      // include: { images: true },
    });

    if (!products) {
      return res.status(404).json({
        isSuccess: false,
        message: 'There is no compare result to export',
      });
    }

    let exportProductsList = products
      ?.filter((item) => !!item?.compareResult)
      ?.map((productItem: any, idx: number) => {
        const compareResult = JSON.parse(productItem?.compareResult);

        let {
          SupplementPanel,
          NutritionPanel,
          generalFactPanels,
          ...restFields
        } = compareResult;

        return productItem?.compareResult
          ? {
              idx,
              ixoneId: productItem?.ixoneID,
              NutritionOrSupplementFactPanel: generalFactPanels,
              ...restFields,
              // NutritionPanel: 'NA',
              // SupplementPanel: 'NA',
              // NutritionPanel: 'produc',
              // SupplementPanel: 'NA',
              // generalFactPanels:
            }
          : [];
      });

    // Determine all unique keys across all products
    const allKeys = Array.from(
      exportProductsList.reduce((keys: Set<string>, product: any) => {
        Object.keys(product).forEach((key) => keys.add(key));
        return keys;
      }, new Set())
    );

    // Calculate the average rating
    const ratings = products
      .filter((product: any) => 'rating' in product)
      .map((product: any) => product.rating);
    const averageRating =
      ratings.reduce((sum: any, rating: any) => sum + rating, 0) /
      ratings.length;

    // Add average rating to the product array as a separate object
    let accuracy = {} as any;
    let sampleAmount = {} as any;

    const AVERAGE_KEY_EXCLUDED = ['idx', 'ixoneId'];

    allKeys.forEach((key: string) => {
      if (AVERAGE_KEY_EXCLUDED.includes(key)) return;

      const accuracyStatistic = computeAverage(exportProductsList, key);
      accuracy[key] = accuracyStatistic?.matchPercent;
      sampleAmount[key] = accuracyStatistic?.sampleAmount;
    });

    exportProductsList.push({
      idx: '',
      ixoneId: '',
      ...accuracy,
    });

    // Define the CSV writer

    let exportAccuracyList = allKeys
      ?.filter((key) => key !== 'idx' && key !== 'ixoneId')
      ?.map((key: string) => {
        return {
          group: TDC_FIELD_OBJ?.[key]?.DataGroup || 'N/A',
          fieldName: key,
          matchPercent: accuracy[key]?.toFixed(2),
          sampleAmount: sampleAmount[key],
        };
      });

    let exportAccuracyListHeader = [
      {
        id: 'group',
        title: 'Group',
      },
      {
        id: 'fieldName',
        title: 'Field Name',
      },
      {
        id: 'matchPercent',
        title: 'Match Percent',
      },
      {
        id: 'sampleAmount',
        title: `Sample Amount in 251 products`,
      },
    ];

    const sortedAccuracyList = sortBy(exportAccuracyList, ['group']);

    //* export all product
    const csvWriter = createObjectCsvWriter({
      path: 'products-com-2.csv',
      header: allKeys.map((key: any) => ({ id: key, title: key })),
    });

    // Write the products to the CSV file
    csvWriter
      .writeRecords(exportProductsList)
      .then(() => {
        console.log('CSV file was written successfully');

        res.status(201).json({
          isSucess: true,
          message: 'export compare result  successfully',
        });
      })
      .catch((err: any) => {
        console.error('Error writing CSV file:', err);
      });

    //* export accuracy list

    const csvWriter2 = createObjectCsvWriter({
      path: 'accuracy_list_251_products.csv',
      header: exportAccuracyListHeader,
    });

    // Write the products to the CSV file
    csvWriter2
      .writeRecords(sortedAccuracyList)
      .then(() => {
        console.log('CSV file was written successfully');

        // res.status(201).json({
        //   isSucess: true,
        //   message: 'export compare result  successfully',
        // });
      })
      .catch((err: any) => {
        console.error('Error writing CSV file:', err);
      });
  } catch (error) {
    res
      .status(500)
      .json({ isSucess: false, message: 'fail to export compare result' });
  }
};

const computeAverage = (products: any, field: string) => {
  const allPercents = products
    .filter(
      (product: any) =>
        field in product &&
        product[field] !== '' &&
        product[field] !== 'NA' &&
        product[field] !== undefined
    )
    .map((product: any) => product?.[field]);
  const averagePercent =
    allPercents.reduce((sum: any, percentValue: any) => {
      if (field === 'NutritionOrSupplementFactPanel') {
        console.log('value', percentValue);
      }
      return sum + (percentValue === 'NaN' ? 0 : Number(percentValue));
    }, 0) / allPercents.length;

  return {
    matchPercent: averagePercent,
    sampleAmount: allPercents.length,
  };
};
