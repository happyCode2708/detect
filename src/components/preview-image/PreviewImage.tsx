import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const PreviewImage = (props: {
  visible: boolean;
  src: string | null;
  size: any;
  onClose: () => void;
}) => {
  const { visible, src, size, onClose } = props;
  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      {/* <DialogTrigger asChild>
        <Button variant='outline'>Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className='w-[1000px] h-[700px] max-h-screen overflow-hidden'>
        <div className='flex-1 flex items-center justify-center relative overflow-hidden p-[10px]'>
          {src && (
            <img
              src={src}
              className='max-w-full max-h-full object-contain object-center'
            />
          )}
        </div>
        {/* <DialogFooter>
        <Button type='submit'>Close</Button>
      </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};
