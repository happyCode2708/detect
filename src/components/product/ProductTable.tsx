'use client';
import React, { useState } from 'react';

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
import { Button, buttonVariants } from '../ui/button';
import Link from 'next/link';
import ProductImageUploadDialog from './ProductImageUploadDialog';

const ProductTable = ({
  products,
  onProductSelect,
  selectedProducts,
}: {
  products: any[];
  onProductSelect: (id: string) => void;
  selectedProducts: Set<string>;
}) => {
  const [uploadDialogActive, setUploadDialogActive] = useState('');

  const toggleUploadDialog = (ixoneId: string) => {
    setUploadDialogActive(ixoneId);
  };

  return (
    <div className='overflow-x-auto'>
      <Table className='min-w-full divide-y divide-gray-200'>
        <TableCaption className='text-left'>Product List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Ixone Id</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Extract Session</TableHead>
            <TableHead>Saved Compare Result</TableHead>
            <TableHead>Tool</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product?.id}>
              <TableCell>
                <input
                  type='checkbox'
                  checked={selectedProducts.has(product.id)}
                  onChange={() => onProductSelect(product.id)}
                />
              </TableCell>
              <TableCell>{product?.ixoneID}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  {product?.images?.map((imageItem: any) => {
                    return (
                      <div className='h-[40px] min-w-[28px] flex justify-center align-middle'>
                        <img
                          src={imageItem?.url}
                          alt='thumb'
                          className='object-contain'
                        ></img>
                      </div>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell>{product?.extractSessions}</TableCell>
              <TableCell>{product?.compareResult ? 'yes' : ''}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <Link
                    className={buttonVariants({ variant: 'destructive' })}
                    href={'/product/ixone/' + product?.ixoneID}
                  >
                    View
                  </Link>
                  <ProductImageUploadDialog
                    isOpen={uploadDialogActive === product?.ixoneID}
                    toggleDialog={toggleUploadDialog}
                    ixoneID={product?.ixoneID}
                  ></ProductImageUploadDialog>
                  {/* <Button>Extract</Button>
                  <Button variant='destructive'>Validate</Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
