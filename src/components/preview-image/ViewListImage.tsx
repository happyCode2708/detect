'use client';
import { useState } from 'react';
import { PreviewImage } from './PreviewImage';
import { Edit, Pencil } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import CustomTooltip from '../cus-tooltip';

export const ViewListImage = ({
  images,
  onSelectBias,
  biasForm,
}: {
  images: any[];
  onSelectBias: (imgIdx: number, formState: any) => void;
  biasForm: any;
}) => {
  const [previewImage, setPreviewImage] = useState<null | string>(null);

  const onPreviewImage = (src: any) => {
    setPreviewImage(src);
  };

  return (
    <>
      <div>
        {images.length === 1 ? (
          <div className='w-[300px] h-[300px] rounded-sm border p-2 flex items-center justify-center relative'>
            <img
              onClick={() => onPreviewImage(images[0])}
              src={images[0]}
              className='max-w-full max-h-full object-contain object-center'
            />

            <div className={cn('absolute top-[3px] right-[3px]')}>
              <PopoverSettingImage
                onSelectBias={onSelectBias}
                imgIdx={0}
                biasForm={biasForm}
              >
                <Button
                  className={cn(
                    buttonVariants({ variant: 'destructive' }),
                    'px-[8px] py-[1px] h-[30px]'
                  )}
                >
                  <Pencil size={15} />
                </Button>
              </PopoverSettingImage>
            </div>
          </div>
        ) : images.length > 1 ? (
          <div className='grid grid-cols-2 gap-2 rounded-sm border p-2'>
            {images?.map((image: any, imgIdx: number) => {
              return (
                <div className='w-[140px] h-[140px] border rounded-sm p-2 flex items-center justify-center relative'>
                  <img
                    src={image}
                    className='max-w-full max-h-full object-contain object-center'
                    onClick={() => onPreviewImage(image)}
                  />
                  <div className={cn('absolute top-[3px] right-[3px]')}>
                    <PopoverSettingImage
                      onSelectBias={onSelectBias}
                      imgIdx={imgIdx}
                      biasForm={biasForm}
                    >
                      <Button
                        className={cn(
                          buttonVariants({ variant: 'destructive' }),
                          'px-[8px] py-[1px] h-[30px]'
                        )}
                      >
                        <Pencil size={15} />
                      </Button>
                    </PopoverSettingImage>
                  </div>
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

const PopoverSettingImage = ({
  children,
  onSelectBias,
  imgIdx,
  biasForm,
}: {
  children: React.ReactNode;
  onSelectBias: (imgIdx: number, formValue: any) => void;
  imgIdx: number;
  biasForm: any;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Bias Selection</h4>
            <h1 className='font-bold'>
              Select bias for image to improve the accuracy of extracted
              information.
            </h1>
            <p className='text-sm text-muted-foreground'>
              Since the system is currently in development, this adjustment will
              help address existing issues, such as the failure of the Object
              Detection Algorithm to detect nutrition facts.
            </p>
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='col-span-3'> Nutrition/Supplement Facts </Label>
              <Checkbox
                checked={biasForm?.[imgIdx]?.haveNutFact || false}
                onCheckedChange={(checked: boolean) =>
                  onSelectBias(imgIdx, { haveNutFact: checked })
                }
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
