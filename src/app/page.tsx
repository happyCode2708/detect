import { FluidContainer } from '@/components/container/FluidContainer';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HomePage = () => {
  return (
    <FluidContainer>
      <div className='flex items-center justify-center h-screen'>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Product</CardTitle>
            <CardDescription>Product Data Management</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className={cn(
                'uppercase shadow-sm p-4 border rounded-md flex align-middle justify-between',
                buttonVariants({ variant: 'link' })
              )}
              href='/product'
            >
              <div className='mr-4'>go to product list</div> <LogIn />
            </Link>
          </CardContent>
          {/* <CardFooter className='flex justify-between'>
            <Button variant='outline'>Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter> */}
        </Card>
      </div>
    </FluidContainer>
  );
};

export default HomePage;
