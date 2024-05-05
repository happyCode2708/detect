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
            <TableHeader className='sticky top-0 bg-secondary z-10'>
              <TableRow>
                <TableHead className='w-[100px]'>ID</TableHead>
                <TableHead>INPUT PATHS</TableHead>
                <TableHead>COLLATE IMAGE</TableHead>
                <TableHead>RESULT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((historyItem: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className='px-2 w-[250px]'>
                    {historyItem.id}
                  </TableCell>
                  <TableCell className='px-2 w-[400px]' key={index}>
                    <ol>
                      {historyItem.inputFilePaths?.map(
                        (filePath: string, idx: number) => {
                          return <li key={idx}>{filePath} </li>;
                        }
                      )}
                    </ol>
                  </TableCell>
                  <TableCell className='px-2 w-[400px]' key={index}>
                    {historyItem.collateImage?.name}
                  </TableCell>
                  <TableCell className='px-2 w-[400px]' key={index}>
                    {historyItem.result?.name}
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
