export const FluidContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto w-screen max-w-screen-2xl'>
      {children && children}
    </div>
  );
};
