import { Skeleton } from '../ui/skeleton';

export const SkeletonSection = () => {
  return (
    <div className='flex flex-col space-y-3'>
      <Skeleton className='w-full h-24 rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>
    </div>
  );
};
