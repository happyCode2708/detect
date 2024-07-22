import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ProductImageUploadForm from './ProductImageUploadForm';

const AddProductForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [ixoneID, setIxoneID] = useState('');

  const [images, setImages] = useState<FileList | null>(null);

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

    const res = await response.json();
    const newProduct = res?.data;

    if (response.ok) {
      toast({
        title: 'Successfully',
        description: 'Product created',
        variant: 'success',
        duration: 2000,
      });
      setIxoneID(''); // Reset the form

      if (images && images?.length > 0) {
        handleUploadImage(newProduct);
      } else {
        onSuccess();
      }
    } else {
      toast({
        title: 'Something went wrong',
        description: 'Fail to create product',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const handleUploadImage = async (product: any) => {
    if (!images || images.length === 0) {
      alert('Please select images to upload');
      return;
    }

    const formData = new FormData();
    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch(`/api/product/${product?.id}/images`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      toast({
        title: 'Successfully',
        description: 'uploaded all iamges',
        variant: 'success',
        duration: 2000,
      });
      setImages(null); // Reset the form
      onSuccess(); // Close the dialog
    } else {
      toast({
        title: 'Something went wrong',
        description: 'Fail to upload product image',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-4 space-y-4'>
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
        <label className='block mb-2'>Upload Images</label>
        <input
          type='file'
          multiple
          onChange={(e) => setImages(e.target.files)}
          className='p-2 border border-gray-300 rounded'
        />
      </div>
      <div className='flex justify-end'>
        <Button type='submit'>Create Product</Button>
      </div>
    </form>
  );
};

export default AddProductForm;
