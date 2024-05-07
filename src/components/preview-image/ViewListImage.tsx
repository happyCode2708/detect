'use client';
import { useState } from 'react';
import { PreviewImage } from './PreviewImage';

export const ViewListImage = ({ images }: { images: any[] }) => {
  const [previewImage, setPreviewImage] = useState<null | string>(null);

  const onPreviewImage = (src: any) => {
    setPreviewImage(src);
  };

  return (
    <>
      <div>
        {images.length === 1 ? (
          <div className='w-[300px] h-[300px] rounded-sm border p-2 flex items-center justify-center'>
            <img
              onClick={() => onPreviewImage(images[0])}
              src={images[0]}
              className='max-w-full max-h-full object-contain object-center'
            />
          </div>
        ) : images.length > 1 ? (
          <div className='grid grid-cols-2 gap-2 rounded-sm border p-2'>
            {images?.map((image: any) => {
              return (
                <div className='w-[140px] h-[140px] border rounded-sm p-2 flex items-center justify-center'>
                  <img
                    src={image}
                    className='max-w-full max-h-full object-contain object-center'
                    onClick={() => onPreviewImage(image)}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <PreviewImage
        visible={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        src={previewImage}
        size={[1000, 1000]}
      />
    </>
  );
};
