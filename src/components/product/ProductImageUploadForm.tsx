import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';

const ProductImageUploadForm = ({
  onSuccess,
  product,
}: {
  onSuccess: any;
  product: any;
}) => {
  const [images, setImages] = useState<FileList | null>(null);

  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
    <form onSubmit={handleSubmit} className='mb-4'>
      <div>
        <label className='block mb-2'>Upload Images</label>
        <input
          type='file'
          multiple
          onChange={(e) => setImages(e.target.files)}
          className='p-2 border border-gray-300 rounded'
        />
      </div>
      <div className='flex justify-end pt-6'>
        <Button type='submit'>Upload Images</Button>
      </div>
    </form>
  );
};

export default ProductImageUploadForm;
