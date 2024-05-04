'use client';
import { useQuery } from '@tanstack/react-query';

const ExtractionHistory = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['history'],
    queryFn: () => fetch('/api/get-history').then((res) => res.json()),
  });

  console.log('data', data);

  return <div> history </div>;
};

export default ExtractionHistory;
