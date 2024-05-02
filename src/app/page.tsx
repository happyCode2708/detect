'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<any>(null);
  const [textfield, setTextfield] = useState('');
  const [reply, setReply] = useState(null);
  const [image, setImage] = useState(null);
  const [resultFileName, setResultFileName] = useState<any>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    // formData.append('textfield', textfield);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // No need to set content type; browser does it for you with FormData
      });

      const res = await response.json();
      // setReply(result?.content);
      const { resultFileName, image } = res;
      // const { content } = result;
      // console.log('result', result);
      // setReply(content);
      setImage(image);
      setResultFileName(resultFileName);

      // alert(result); // Displaying the response message
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file.');
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
    <div className='flex flex-col gap-10'>
      <form onSubmit={handleSubmit}>
        <input type='file' onChange={handleSelectFile} required />
        <button type='submit'>PROCESS</button>
      </form>
      <div className='flex flex-row'>
        {image && (
          <div className='w-[300px] min-w-[300px]'>
            <img src={image} className='w-full aspect-auto' />
          </div>
        )}
        {reply && <div>{reply}</div>}
      </div>
    </div>
  );
}
