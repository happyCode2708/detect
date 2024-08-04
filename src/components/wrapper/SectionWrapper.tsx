import { cn } from '@/lib/utils';

export const SectionWrapper = ({
  title,
  children,
  className,
  boxClassName,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  boxClassName?: string;
}) => {
  return (
    <div className={cn('pt-6 relative', className)}>
      <div
        className={cn(
          'border rounded-md px-[10px] py-[20px] min-h-[66px]',
          boxClassName
        )}
      >
        {title && (
          <div className='font-bold border rounded-lg px-[8px] py-[2px] absolute top-[8px] lef-[35px] bg-white'>
            {title}
          </div>
        )}
        <div className='overflow-auto w-full h-full'>
          {children && children}
        </div>
      </div>
    </div>
  );
};
