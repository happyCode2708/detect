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
            <span> {data?.servingSize?.uom}</span>
          )}
        </span>
      </div>
      {data?.amountPerServing && (
        <div>
          <span className='font-bold'>Amout Per Serving:</span>
          <span>{data?.amountPerServing?.name} </span>
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
            return (
              <>
                <TableRow key={index}>
                  <TableCell>
                    <span>{nutrient.name}</span>
                    {nutrient?.descriptor && (
                      <span>({nutrient?.descriptor})</span>
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
              </>
            );
          })}
        </TableBody>
      </Table>
      <div>
        <div className='font-bold'>Footnote: </div>
        <p>{data?.footnote?.value} </p>
      </div>
      <div>
        <div className='font-bold'>Footnote Indicator: </div>
        <ul>
          {data?.footnote?.footnoteIndicatorList?.map((indicator: string) => (
            <li key={indicator}> {indicator} </li>
          ))}
        </ul>
      </div>
      <div>
        <div className='font-bold'>Ingredients: </div>
        <p>{data?.ingredients} </p>
      </div>
      <div>
        <div className='font-bold'>Contain: </div>
        <p>{data?.contain} </p>
      </div>
      {/* <div>
        <div className='font-bold'>OCR text: </div>
        <div className='whitespace-pre-line'>{data?.ocrText} </div>
      </div> */}
    </div>
  );
};

export default NutritionTable;
