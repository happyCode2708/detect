'use client';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import NutritionTable from '@/components/table/NutritionTable';
import ExtractionHistory from '@/components/extract-history/ExtractionHitory';
import { useMutateUploadFile } from '@/queries/home';

export default function Home() {
  const [files, setFiles] = useState<any>([]);
  const [reply, setReply] = useState([]);
  const [images, setImages] = useState<any>([]);
  const [resultFileName, setResultFileName] = useState<any>();
  const [loading, setLoading] = useState(false);

  const refInput = useRef() as React.RefObject<HTMLInputElement>;
  const refInterval = useRef<number | null>(null);

  const mutationUploadFile = useMutateUploadFile();

  const handleSubmit = async () => {
    if (!files.length) return;

    const formData = new FormData();

    files.forEach((file: any) => {
      formData.append('file', file);
    });

    setLoading(true);
    setReply([]);
    mutationUploadFile.mutate(formData, {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: (res) => {
        const { resultFileName, images } = res;
        setImages(images);
        // setImages((prev: any) => [...prev, image]);
        setResultFileName(resultFileName);
      },
    });
  };

  const onCancel = () => {
    setLoading(false);
    setResultFileName('');
    setReply([]);
    if (refInterval.current) {
      window.clearInterval(refInterval.current);
    }
  };

  const onClearFile = () => {
    setFiles([]);
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
          setImages(fileDataUrls);
        }
      };

      fileReader.readAsDataURL(file);
    });
  };

  console.log('files', files);
  console.log('images', images);

  useEffect(() => {
    // let interval: any;
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
          // console.log('test', { data, proc: JSON.parse(data) });
          setReply(JSON.parse(data));
          if (refInterval.current) {
            clearInterval(refInterval.current);
          }

          setLoading(false);
          // console.log('Data retrieved:', data);
          // return data; // Optionally return data for further processing
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }, 4500);
    }
    return () => {
      if (!refInterval.current) return;

      window.clearInterval(refInterval.current);
    };
  }, [resultFileName]);

  return (
    <div className='flex flex-col gap-10 p-10'>
      <div className='flex flex-row items-center w-full gap-2'>
        <div className='rounded-md p-4 border flex flex-row gap-2'>
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
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <div className='flex flex-row items-center'>
              <RefreshCcw className='mr-1 animate-spin' />
              <span>Proccessing</span>
            </div>
          ) : (
            'Extract'
          )}
        </Button>
        {loading && (
          <Button variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <ExtractionHistory />

      <div className='flex flex-row gap-4'>
        <div>
          {images.length === 1 ? (
            <div className='w-[300px] min-w-[300px] rounded-sm border p-2'>
              <img src={images[0]} className='w-full aspect-auto' />
            </div>
          ) : images.length > 1 ? (
            <div className='grid grid-cols-3 gap-2 rounded-sm border p-2'>
              {images?.map((image: any) => {
                return (
                  <div className='w-[140px] h-[140px] border rounded-sm p-2 flex items-center justify-center'>
                    <img
                      src={image}
                      className='max-w-full max-h-full object-contain object-center'
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {reply && reply?.length > 0 ? (
          <div className='p-4 border rounded-md flex-1 overflow-auto max-h-[500px]'>
            {reply.map((labelData: any, idx: number) => {
              return <NutritionTable data={labelData} key={idx} />;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
