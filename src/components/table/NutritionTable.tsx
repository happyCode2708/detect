import React from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const NutritionTable = ({ data }: { data: any }) => {
  return (
    <div className='pb-4'>
      <div className='text-2xl font-bold mb-2'>{data?.title}</div>
      <div>
        <span className='font-bold'>Serving Per Container:</span>
        {data?.servingInfo?.servingPerContainer && (
          <span>{data?.servingInfo?.servingPerContainer}</span>
        )}
      </div>
      <div>
        <span className='font-bold'>Serving Size:</span>
        <span>{data?.servingInfo?.servingSize}</span>
        {data?.servingInfo?.equivalentServingSize && (
          <>
            <span> __ </span>
            <span>{data?.servingInfo?.equivalentServingSize}</span>
          </>
        )}
      </div>
      {data?.servingInfo?.amountPerServingName && (
        <div>
          <span className='font-bold'>Amount Per Serving:</span>
          <span>{data?.servingInfo?.amountPerServingName} </span>
        </div>
      )}
      <div>
        <span className='font-bold'>Calories:</span>
        <span>{data?.servingInfo?.calories} </span>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>ANCILARRRY INFO</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>DAILY PERCENT</TableHead>
            <TableHead>FOOTNOTE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.nutritionFacts?.map((nutrient: any, index: number) => {
            return (
              <>
                <TableRow>
                  <TableCell>
                    <div>{nutrient?.nutrientName}</div>
                  </TableCell>
                  <TableCell>
                    {nutrient?.parenthesesDescriptor && (
                      <div className='mt-6'>
                        <div className='pl-[8px]'>
                          {nutrient?.parenthesesDescriptor}
                        </div>
                      </div>
                    )}
                    {nutrient?.blendIngredients && (
                      <div className='mt-6 whitespace-pre-line'>
                        <div className='pl-[8px]'>
                          {nutrient?.blendIngredients}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell key={index}>
                    <span>{nutrient?.amountPerServing}</span>
                    {nutrient?.amountPerServingDescriptor && (
                      <span>{nutrient?.amountPerServingDescriptor}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span>{nutrient?.dailyValue}</span>
                  </TableCell>
                  <TableCell>
                    {nutrient?.symbol !== null && (
                      <span> {nutrient?.symbol}</span>
                    )}
                  </TableCell>
                </TableRow>

                {/* {nutrient?.nutrient_sub_ingredients?.map(
                  (subIngredient: any, idx: number) => {
                    return (
                      <TableRow
                        className={
                          idx === nutrient?.nutrient_sub_ingredients?.length - 1
                            ? ''
                            : 'border-none'
                        }
                      >
                        <TableCell className='pl-10'>
                          {subIngredient?.info}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {subIngredient?.sub_ingredients_footNoteIndicator}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )} */}
              </>
            );
          })}
          {/* {data.dietaryIngredients?.length > 0 && (
            <>
              <TableRow>
                <TableCell
                  className='h-[6px] w-full bg-black'
                  style={{ padding: 0 }}
                ></TableCell>
                <TableCell
                  className='h-[6px] w-full bg-black'
                  style={{ padding: 0 }}
                ></TableCell>
                <TableCell
                  className='h-[6px] w-full bg-black'
                  style={{ padding: 0 }}
                ></TableCell>
                <TableCell
                  className='h-[6px] w-full bg-black'
                  style={{ padding: 0 }}
                ></TableCell>
              </TableRow>

              {data.dietaryIngredients?.map((nutrient: any, index: number) => {
                return (
                  <>
                    <TableRow key={index}>
                      <TableCell>
                        <span>{nutrient.name}</span>
                        {nutrient?.ingredientDescriptor && (
                          <span>({nutrient?.ingredientDescriptor})</span>
                        )}
                      </TableCell>
                      <TableCell key={index}>
                        {![null, undefined].includes(
                          nutrient?.quantityComparisonOperator
                        ) && <span>{nutrient.quantityComparisonOperator}</span>}
                        {nutrient?.value}
                        {nutrient?.uom ?? <span>{nutrient?.uom}</span>}
                        {![null, undefined].includes(
                          nutrient?.quantityDescription
                        ) && <span>({nutrient?.quantityDescription})</span>}
                      </TableCell>
                      <TableCell>
                        {![null, undefined].includes(
                          nutrient?.dailyPercentComparisonOperator
                        ) && (
                          <span>{nutrient.dailyPercentComparisonOperator}</span>
                        )}
                        {![null, undefined].includes(
                          nutrient?.percentDailyValue
                        ) && <span> {nutrient.percentDailyValue}%</span>}
                      </TableCell>
                      <TableCell>
                        {nutrient.footnoteIndicator !== null && (
                          <span> {nutrient.footnoteIndicator}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </>
          )} */}
        </TableBody>
      </Table>
      <div>
        <div className='font-bold'>Footnote: </div>
        <p>
          {data?.footnotes?.map((footnote: any) => {
            return <span> {footnote?.footnoteContentEnglish}, </span>;
          })}
        </p>
      </div>
    </div>
  );
};

export default NutritionTable;
