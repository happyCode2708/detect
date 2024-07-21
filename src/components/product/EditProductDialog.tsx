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
import { useQueryClient } from '@tanstack/react-query';

const EditProductDialog = ({
  isOpen,
  toggleDialog,
}: {
  isOpen: boolean;
  toggleDialog: () => void;
}) => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toggleDialog();
    queryClient.invalidateQueries({ queryKey: ['product', 'list'] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button className='mb-4' onClick={toggleDialog}>
          Edit Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new product.
          </DialogDescription>
        </DialogHeader>
        <AddProductForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
