'use client';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExtractionHistory from '@/components/extract-history/ExtractionHitory';
import { useMutateUploadFile } from '@/queries/home';
import { FluidContainer } from '@/components/container/FluidContainer';
import { Result } from '@/components/result/Result';
import { useQueryClient } from '@tanstack/react-query';
import { PreviewImage } from '@/components/preview-image/PreviewImage';
import { ViewListImage } from '@/components/preview-image/ViewListImage';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Home() {
  const [files, setFiles] = useState<any>([]);
  const [productInfo, setProductInfo] = useState(null);
  const [inputImages, setInputImages] = useState<any>([]);
  const [procImages, setProcImages] = useState<any>([]);

  const [resultFileName, setResultFileName] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<null | string>(null);

  const refInput = useRef() as React.RefObject<HTMLInputElement>;
  const refInterval = useRef<number | null>(null);

  const mutationUploadFile = useMutateUploadFile();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!files.length) return;

    const formData = new FormData();

    files.forEach((file: any) => {
      formData.append('file', file);
    });

    setLoading(true);
    setProductInfo(null);

    mutationUploadFile.mutate(formData, {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: (res) => {
        const { resultFileName, images } = res;
        if (images?.length > 0) {
          setProcImages(images);
        }
        setResultFileName(resultFileName);
        queryClient.invalidateQueries({ queryKey: ['history'] });
      },
    });
  };

  const onCancel = () => {
    setLoading(false);
    setResultFileName('');
    setProductInfo(null);
    if (refInterval.current) {
      window.clearInterval(refInterval.current);
    }
  };

  const onClearFile = () => {
    setFiles([]);
    setInputImages([]);
    setProcImages([]);
    if (!refInput.current) return;
    refInput.current.value = '';
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    setFiles(files);
    const fileReaders = [];
    let fileDataUrls: any = [];

    if (files.length === 0) return;

    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReaders.push(fileReader);

      fileReader.onload = (e) => {
        if (!e?.target) return;

        fileDataUrls.push(e.target.result);

        // Only update state when all files are read
        if (fileDataUrls.length === files.length) {
          setInputImages(fileDataUrls);
        }
      };

      fileReader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (resultFileName) {
      refInterval.current = window.setInterval(async () => {
        try {
          const response = await fetch(
            '/api/fact/get-result/' + resultFileName
          );
          if (!response.ok) {
            throw new Error(
              'Network response was not ok ' + response.statusText
            );
          }
          const data = await response.json();

          const result = data;

          const { isSuccess } = result || {};

          if (isSuccess === false) {
            setLoading(false);
            toast({
              title: 'Something went wrong',
              description: 'Failed to process. Please try again',
              variant: 'destructive',
              duration: 7000,
            });
            if (refInterval.current) {
              clearInterval(refInterval.current);
            }
            return;
          }

          setProductInfo(result);

          toast({
            title: 'Successfully',
            description: 'Images processing is complete',
            variant: 'success',
            duration: 5000,
          });

          if (refInterval.current) {
            clearInterval(refInterval.current);
          }

          setLoading(false);
        } catch (error) {
          console.error('Wait for result', error);
        }
      }, 4500);
    }
    return () => {
      if (!refInterval.current) return;

      window.clearInterval(refInterval.current);
    };
  }, [resultFileName]);

  return (
    <FluidContainer>
      <div className='flex flex-col gap-10 p-10'>
        <div className='flex flex-row items-center w-full gap-2'>
          <div className='rounded-md p-4 border flex flex-row gap-2 flex-1'>
            <Input
              ref={refInput}
              type='file'
              onChange={handleSelectFile}
              required
              multiple
            />
            <Button variant='destructive' onClick={onClearFile}>
              Clear
            </Button>
          </div>
          <Button
            disabled={loading || files?.length <= 0}
            onClick={handleSubmit}
          >
            {loading ? (
              <div className='flex flex-row items-center'>
                <RefreshCcw className='mr-1 animate-spin' />
                <span>Proccessing</span>
              </div>
            ) : (
              'Process'
            )}
          </Button>
          {loading && (
            <Button variant='secondary' onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {/* <ExtractionHistory /> */}

        <div className='flex flex-row gap-4'>
          <div>
            {inputImages?.length > 0 && (
              <SectionWrapper title='Input Images'>
                <ViewListImage images={inputImages} />
              </SectionWrapper>
            )}
            {procImages?.length > 0 && (
              <SectionWrapper title='Processed Images'>
                <ViewListImage images={procImages} />
              </SectionWrapper>
            )}
          </div>

          {productInfo && (
            <div className='flex-1 overflow-hidden'>
              <SectionWrapper title='Result'>
                <Result productInfo={productInfo} />
              </SectionWrapper>
            </div>
          )}
          {loading && (
            <div className='flex-1 overflow-hidden pt-6'>
              <Alert>
                <Loader className='h-4 w-4' />
                <AlertTitle>Processing!</AlertTitle>
                <AlertDescription>
                  Your images are currently being processed in a background
                  task. You will be notified once the processing is complete.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
      <PreviewImage
        visible={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        src={previewImage}
        size={[1000, 1000]}
      />
    </FluidContainer>
  );
}

const SectionWrapper = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='pt-6 relative'>
      <div className='border rounded-md p-[10px] pt-[20px]'>
        {title && (
          <div className='font-bold border rounded-lg px-[8px] py-[2px] absolute top-[8px] lef-[35px] bg-white'>
            {title}
          </div>
        )}
        {children && children}
      </div>
    </div>
  );
};
