'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [file, setFile] = useState<any>(null);
  const [reply, setReply] = useState(null);
  const [image, setImage] = useState(null);
  const [resultFileName, setResultFileName] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // No need to set content type; browser does it for you with FormData
      });

      const res = await response.json();
      const { resultFileName, image } = res;

      setImage(image);
      setResultFileName(resultFileName);

      // alert(result); // Displaying the response message
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file.');
      setLoading(false);
    }
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    let interval: any;

    if (resultFileName) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/get-result/' + resultFileName);
          if (!response.ok) {
            throw new Error(
              'Network response was not ok ' + response.statusText
            );
          }
          const data = await response.json();

          setReply(data);
          clearInterval(interval);
          setLoading(false);
          // console.log('Data retrieved:', data);
          // return data; // Optionally return data for further processing
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }, 4500);
    }

    return () => clearInterval(interval);
  }, [resultFileName]);

  return (
    <div className='flex flex-col gap-10 p-10'>
      <div className='flex flex-row items-center w-full'>
        <div className='rounded-md p-4 border mr-6'>
          <Input type='file' onChange={handleSelectFile} required />
        </div>
        <button
          className={cn(
            'rounded-md border px-4 py-2 bg-orange-500 text-white cursor-pointer h-[50px] w-[150px]',
            loading ? 'bg-gray-300 text-muted-foreground' : ''
          )}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <div className='flex flex-row items-center'>
              <RefreshCcw className='mr-1' /> <span>Proccessing</span>
            </div>
          ) : (
            'Extract'
          )}
        </button>
      </div>
      <div className='flex flex-row gap-4'>
        {image && (
          <div className='w-[300px] min-w-[300px]'>
            <img src={image} className='w-full aspect-auto' />
          </div>
        )}
        {reply && (
          <div className='whitespace-pre p-4 border rounded-md flex-1'>
            {reply}
          </div>
        )}
      </div>
    </div>
  );
}
