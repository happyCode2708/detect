'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import NutritionTable from '@/components/table/NutritionTable';
import ExtractionHistory from '@/components/extract-history/ExtractionHitory';

const mock =
  '[\n  {\n    "panelName": "Nutrition Facts",\n    "amountPerServing": {"value": 140, "uom": "Calories"},\n    "servingSize": {"value": "4 oz.", "uom": "(112g)"},\n    "servingPerContainer": {"value": null, "uom": "Varied servings per container"},\n    "nutrients": [\n      {"name": "Total Fat", "value": 4, "uom": "g", "percentDailyValue": 5},\n      {"name": "Saturated Fat", "value": 1.5, "uom": "g", "percentDailyValue": 8},\n      {"name": "Trans Fat", "value": 0, "uom": "g", "percentDailyValue": null},\n      {"name": "Polyunsaturated Fat", "value": 0.5, "uom": "g", "percentDailyValue": null},\n      {"name": "Monounsaturated Fat", "value": 2, "uom": "g", "percentDailyValue": null},\n      {"name": "Cholesterol", "value": 65, "uom": "mg", "percentDailyValue": 22},\n      {"name": "Sodium", "value": 40, "uom": "mg", "percentDailyValue": 2},\n      {"name": "Total Carbohydrate", "value": 0, "uom": "g", "percentDailyValue": 0},\n      {"name": "Dietary Fiber", "value": 0, "uom": "g", "percentDailyValue": 0},\n      {"name": "Total Sugars", "value": 0, "uom": "g", "percentDailyValue": null},\n      {"name": "Added Sugars", "value": 0, "uom": "g", "percentDailyValue": 0},\n      {"name": "Protein", "value": 25, "uom": "g", "percentDailyValue": 50},\n      {"name": "Vitamin D", "value": 0, "uom": "mcg", "percentDailyValue": 0},\n      {"name": "Calcium", "value": 0, "uom": "mg", "percentDailyValue": 0},\n      {"name": "Iron", "value": 0, "uom": "mg", "percentDailyValue": 0},\n      {"name": "Potassium", "value": 370, "uom": "mg", "percentDailyValue": 8}\n    ],\n    "note": "The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.",\n    "ingredients": ""\n  }\n]\n';

const data = JSON.parse(mock);

export default function Home() {
  const [file, setFile] = useState<any>(null);
  const [reply, setReply] = useState([]);
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
      setReply([]);
      const response = await fetch('/api/upload/gemini', {
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
          // console.log('test', { data, proc: JSON.parse(data) });
          setReply(JSON.parse(data));
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
        {/* {reply && (
          <div className='whitespace-pre p-4 border rounded-md flex-1 overflow-auto max-h-[500px]'>
            {reply}
          </div>
        )} */}
        {reply && reply?.length > 0 ? (
          <div className='p-4 border rounded-md flex-1 overflow-auto max-h-[500px]'>
            {reply.map((labelData: any, idx: number) => {
              return <NutritionTable data={labelData} key={idx} />;
            })}
          </div>
        ) : null}
      </div>
      <div>
        <ExtractionHistory />
      </div>
    </div>
  );
}
