import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddProductForm from './AddProductForm';
import { Button } from '../ui/button';

const ProductDialog = ({
  isOpen,
  toggleDialog,
}: {
  isOpen: boolean;
  toggleDialog: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button className='mb-4' onClick={toggleDialog}>
          Create New Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new product.
          </DialogDescription>
        </DialogHeader>
        <AddProductForm onSuccess={toggleDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
