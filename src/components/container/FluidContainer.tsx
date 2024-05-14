export const FluidContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto w-screen max-w-screen-xl'>
      {children && children}
    </div>
  );
};
