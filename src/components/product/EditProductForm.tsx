import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const EditProductForm = ({
  product,
  onSuccess,
}: {
  product: any;
  onSuccess: () => void;
}) => {
  // const [ixoneID, setIxoneID] = useState('');

  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/product/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
      toast({
        title: 'Successfully',
        description: 'Product created',
        variant: 'success',
        duration: 2000,
      });
      onSuccess();
      setIxoneID(''); // Reset the form
    } else {
      toast({
        title: 'Something went wrong',
        description: 'Fail to create product',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-4'>
      <div>
        <label className='block mb-2'>Ixone ID (not required)</label>
        <input
          type='text'
          value={ixoneID}
          onChange={(e) => setIxoneID(e.target.value)}
          className='p-2 border border-gray-300 rounded'
        />
      </div>
      <div>
        <label className='block mb-2'>Ixone ID (not required)</label>
        <input
          type='text'
          value={ixoneID}
          onChange={(e) => setIxoneID(e.target.value)}
          className='p-2 border border-gray-300 rounded'
        />
      </div>
      <div className='flex justify-end'>
        <Button type='submit'>Create Product</Button>
      </div>
    </form>
  );
};

export default EditProductForm;
