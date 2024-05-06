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
        <span className='font-bold'>Calories:</span>
        <span>{data?.amountPerServing?.value} </span>
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
      <div>
        <span className='font-bold'>Serving Per Container:</span>
        <span>
          {data?.servingPerContainer?.value}{' '}
          {data?.servingPerContainer?.stringAfterValue}
        </span>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>NAME</TableHead>
            <TableHead>INFO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.nutrients.map((nutrient: any, index: number) => (
            <TableRow key={index}>
              <TableCell className='px-2 w-[250px]'>{nutrient.name}</TableCell>
              <TableCell className='px-2 w-[400px]' key={index}>
                {nutrient?.value}
                {nutrient?.uom ?? <span>{nutrient?.uom}</span>}
                {nutrient.percentDailyValue !== null && (
                  <span> ({nutrient.percentDailyValue}%)</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableRow>
          <TableCell className='px-2 w-[250px]'>Ingredients</TableCell>
          <TableCell className='px-2 w-[400px]'>{data?.ingredients}</TableCell>
        </TableRow> */}
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
