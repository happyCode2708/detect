'use client';
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import ProductImageUploadForm from './ProductImageUploadForm';
import { useQueryClient } from '@tanstack/react-query';

interface ImageUploadDialogProps {
  isOpen: boolean;
  toggleDialog: (ixoneId: string) => void;
  product: any;
  disable?: boolean;
}

const ProductImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  toggleDialog,
  product,
  disable,
}) => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toggleDialog('');
    queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
    queryClient.invalidateQueries({
      queryKey: ['product', 'id', `${product?.id}`],
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => toggleDialog(open ? product?.id : '')}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => toggleDialog(product?.id)}
          className='mb-4'
          disabled={disable}
        >
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Select and upload images for the product.
          </DialogDescription>
        </DialogHeader>
        <ProductImageUploadForm product={product} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageUploadDialog;
