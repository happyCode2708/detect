import { FluidContainer } from '@/components/container/FluidContainer';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <FluidContainer>
      <div className='p-4'>
        <Link
          className={cn(
            'uppercase shadow-md p-4 border rounded-md flex align-middle justify-between',
            buttonVariants({ variant: 'link' })
          )}
          href='/product'
        >
          <div className='mr-4'>go to product list</div> <LogIn />
        </Link>
      </div>
    </FluidContainer>
  );
};

export default HomePage;
