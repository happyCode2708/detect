'use client';
import React from 'react';
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// }
// import { Button } from '@shadcn/ui-button';
// import ImageUploadForm from './ImageUploadForm';
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
  ixoneID: string;
}

const ProductImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  toggleDialog,
  ixoneID,
}) => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toggleDialog('');
    queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => toggleDialog(open ? ixoneID : '')}
    >
      <DialogTrigger asChild>
        <Button onClick={() => toggleDialog(ixoneID)} className='mb-4'>
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
        <ProductImageUploadForm ixoneID={ixoneID} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageUploadDialog;
