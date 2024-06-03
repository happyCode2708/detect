export const SectionWrapper = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='pt-6 relative'>
      <div className='border rounded-md px-[10px] py-[20px] min-h-[66px]'>
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
