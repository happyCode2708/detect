export const FluidContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto w-screen max-w-screen-lg'>
      {children && children}
    </div>
  );
};
