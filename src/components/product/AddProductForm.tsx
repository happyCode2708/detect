import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const AddProductForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [ixoneID, setIxoneID] = useState('');

  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ixoneID }),
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
        <label className='block mb-2'>Ixone ID</label>
        <input
          type='text'
          value={ixoneID}
          onChange={(e) => setIxoneID(e.target.value)}
          className='p-2 border border-gray-300 rounded'
          required
        />
      </div>
      <div className='flex justify-end'>
        <Button type='submit' disabled={!ixoneID}>
          Create Product
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
