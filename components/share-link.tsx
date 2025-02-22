import { useToast } from '@/hooks/use-toast';
import React, { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Copy, PlusCircleIcon } from 'lucide-react';
import { Form } from './ui/form';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface ShareLinkProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  chatId: string;
}

export const ShareLink = ({ isOpen, setIsOpen, chatId }: ShareLinkProps) => {
  const { toast } = useToast();
  const host = window.location.host;

  const linkToChat =
    process.env.NODE_ENV === 'development'
      ? `http://${host}/chat/${chatId}`
      : `https://${host}/chat/${chatId}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(linkToChat);
      console.log('Text copied to clipboard');

      toast({
        title: 'Copied Successfully',
        description:
          'Share this to the person you want to chat with! (NOTE: They must be added to the Chat to access it!)',
        className: 'bg-green-600 text-white',
      });
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      defaultOpen={isOpen}
    >
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <Copy className="mr-2" />
          Share Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>
            Any user who has been{' '}
            <span className="text-indigo-600 font-bold">granted access</span>{' '}
            can use this link
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={linkToChat} readOnly />
          </div>

          <Button
            type="submit"
            size={'sm'}
            onClick={() => copyToClipboard()}
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant={'secondary'}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
