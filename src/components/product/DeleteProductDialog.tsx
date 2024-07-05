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

const DeleteProductDialog = ({
  isOpen,
  toggleDialog,
  handleDeleteProduct,
  disabled,
}: {
  isOpen: boolean;
  toggleDialog: () => void;
  handleDeleteProduct: () => void;
  disabled: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button
          className='mb-4'
          onClick={toggleDialog}
          variant='destructive'
          disabled={disabled}
        >
          Delete Products
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product Confirm</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all selected products?
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end space-x-1'>
          <Button variant='destructive' onClick={handleDeleteProduct}>
            Delete products
          </Button>
          <Button onClick={toggleDialog}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
