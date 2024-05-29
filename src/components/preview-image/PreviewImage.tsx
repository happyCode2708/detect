import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
      <DialogContent className='w-[1000px] max-h-screen h-screen overflow-hidden flex flex-col'>
        <div className='flex-1 flex items-center justify-center relative overflow-hidden p-[10px]'>
          {src && (
            <img
              src={src}
              className='max-w-full max-h-full object-contain object-center'
            />
          )}
        </div>
        <DialogFooter className='h-[50px]'>
          <Button type='submit'>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
