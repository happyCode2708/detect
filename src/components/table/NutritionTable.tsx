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
      <div className='text-2xl font-bold mb-2'>{data.panelName}</div>
      <div>
        <span className='font-bold'>Serving Per Container:</span>
        <span>
          {data?.servingPerContainer?.description}
          {data?.servingPerContainer?.value} {data?.servingPerContainer?.uom}
        </span>
      </div>
      <div>
        <span className='font-bold'>Serving Size:</span>
        <span>
          {data?.servingSize?.value}
          {data?.servingSize?.uom !== null && (
            <>
              <span> {data?.servingSize?.uom}</span>
            </>
          )}
        </span>
        {data?.servingSize?.equivalent && (
          <>
            <span> __ </span>
            <span>{data?.servingSize?.equivalent?.value}</span>
            <span>{data?.servingSize?.equivalent?.uom}</span>
          </>
        )}
      </div>
      {data?.amountPerServing?.percentDailyValueFor && (
        <div>
          <span className='font-bold'>Amout Per Serving:</span>
          <span>{data?.amountPerServing?.percentDailyValueFor} </span>
        </div>
      )}
      <div>
        <span className='font-bold'>Calories:</span>
        <span>{data?.calories?.value} </span>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>QUANTITY</TableHead>
            {/* <TableHead>UOM</TableHead> */}
            <TableHead>DAILY PERCENT</TableHead>
            <TableHead>FOOTNOTE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.nutrients.map((nutrient: any, index: number) => {
            // const isHaveSubIngredient =
            //   nutrient?.nutrient_sub_ingredients?.length > 0;

            return (
              <>
                <TableRow
                  key={index}
                  // className={isHaveSubIngredient ? 'border-none' : ''}
                >
                  <TableCell>
                    <span>{nutrient.name}</span>
                    {nutrient?.descriptor_or_subIngredientList && (
                      <span>({nutrient?.descriptor_or_subIngredientList})</span>
                    )}
                  </TableCell>
                  <TableCell key={index}>
                    {![null, undefined].includes(
                      nutrient?.quantityComparisonOperator
                    ) && <span>{nutrient.quantityComparisonOperator}</span>}
                    {nutrient?.value}
                    {nutrient?.uom ?? <span>{nutrient?.uom}</span>}
                    {![null, undefined].includes(
                      nutrient?.quantityEquivalent
                    ) && <span>({nutrient?.quantityEquivalent})</span>}
                  </TableCell>
                  <TableCell>
                    {![null, undefined].includes(
                      nutrient?.dailyPercentComparisonOperator
                    ) && <span>{nutrient.dailyPercentComparisonOperator}</span>}
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
        <p>{data?.footnote} </p>
      </div>
    </div>
  );
};

export default NutritionTable;
