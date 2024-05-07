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
            <TableHead>VALUE</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead>DAILY PERCENT</TableHead>
            <TableHead>ADDITIONAL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.nutrients.map((nutrient: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{nutrient.name}</TableCell>
              <TableCell key={index}>{nutrient?.value}</TableCell>
              <TableCell>
                {nutrient?.uom ?? <span>{nutrient?.uom}</span>}
              </TableCell>
              <TableCell>
                {![null, undefined].includes(nutrient?.percentDailyValue) && (
                  <span> ({nutrient.percentDailyValue}%)</span>
                )}
              </TableCell>
              <TableCell>
                {nutrient.endSymbol !== null && (
                  <span> {nutrient.endSymbol}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <div className='font-bold'>Note: </div>
        <p>{data?.note} </p>
      </div>
      <div>
        <div className='font-bold'>Ingredients: </div>
        <p>{data?.ingredients} </p>
      </div>
      <div>
        <div className='font-bold'>Contain: </div>
        <p>{data?.contain} </p>
      </div>
    </div>
  );
};

export default NutritionTable;
