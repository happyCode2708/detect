'use client';
import { useQuery } from '@tanstack/react-query';
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
import { Button } from '../ui/button';
import { useState } from 'react';
import Link from 'next/link';

const ExtractionHistory = () => {
  const [show, setShow] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ['history'],
    queryFn: () => fetch('/api/fact/get-history').then((res) => res.json()),
  });

  console.log('data', data);

  return (
    <div>
      <Button onClick={() => setShow((prev) => !prev)}>
        {show ? 'Hide' : 'Show'} History
      </Button>
      {show && (
        <div className='h-[350px] overflow-auto relative mt-2'>
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader className='sticky top-0 bg-secondary z-10'>
              <TableRow>
                <TableHead className='w-[100px]'>ID</TableHead>
                <TableHead>IMAGE</TableHead>
                <TableHead>RESULT</TableHead>
                {/* <TableHead>Method</TableHead> */}
                {/* <TableHead className='text-right'>Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((historyItem: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className='px-2 w-[250px]'>
                    {historyItem.id}
                  </TableCell>
                  <TableCell className='px-2 w-[400px]' key={index}>
                    <Link href={historyItem.images[0]?.url}>
                      {historyItem.images[0]?.name}
                    </Link>
                  </TableCell>
                  <TableCell className='px-2 w-[400px]' key={index}>
                    <Link href={historyItem.result?.url}>
                      {historyItem.result?.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ExtractionHistory;
