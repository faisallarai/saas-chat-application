'use client';

import { useToast } from '@/hooks/use-toast';
import useAdminId from '@/hooks/useAdminId';
import { useSubscriptionStore } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { addChatRef, chatMembersRef } from '@/lib/converters/chat-members';
import { ToastAction } from './ui/toast';
import { ShareLink } from './share-link';
import { getUserByEmailRef } from '@/lib/converters/user';
import { error } from 'console';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const InviteUser = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const adminId = useAdminId({ chatId });
  const subscription = useSubscriptionStore((state) => state.subscription);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openInviteLink, setOpenInviteLink] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user.id) return;

    toast({
      title: 'Sending invite',
      description: 'Please wait while we send the invite ...',
    });

    // We need to get the users current chats to check if they are about to exceed the PRO plan
    const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    // Check if the user is about to exceed the PRO plan which is 3 chats
    const isPro =
      subscription?.role === 'pro' && subscription.status === 'active';

    // If chats is more than 2 quit execution with return
    if (!isPro && noOfUsersInChat >= 2) {
      toast({
        title: 'Free plan limit exceeded',
        description:
          'You have exceeded the limit of users in a single chat for the FREE plan. Please upgrade to PRO to continue adding users to chats!',
        variant: 'destructive',
        action: (
          <ToastAction
            altText="Upgrade"
            onClick={() => router.push('/register')}
          >
            Upgrade to PRO
          </ToastAction>
        ),
      });

      return;
    }

    const querySnapshot = await getDocs(getUserByEmailRef(values.email));

    if (querySnapshot.empty) {
      toast({
        title: 'User not found',
        description:
          'Please enter an email address of a registered user OR resend the invitation once they have signed up!',
        variant: 'destructive',
      });

      return;
    } else {
      // Get the details of the invited user
      const user = querySnapshot.docs[0].data();

      // Add the invited user to the chat
      await setDoc(addChatRef(chatId, user.id!), {
        userId: user.id!,
        email: user.email!,
        timestamp: serverTimestamp(),
        chatId: chatId,
        isAdmin: false,
        image: user.image || '',
      })
        .then(() => {
          setOpen(false);

          toast({
            title: 'Added to chat',
            description: 'The user has been added to the chat successfully!',
            className: 'bg-green-600 text-white',
            duration: 3000,
          });

          setOpenInviteLink(true);
        })
        .catch((error) => {
          console.log('invitaion error', error);
          toast({
            title: 'Error',
            description: 'Whoops... there was an adding the user to the chat!',
            variant: 'destructive',
          });

          setOpen(false);
        });
    }

    form.reset();
  };

  return (
    adminId === session?.user.id && (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="mr-1" />
              Add User To Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add User To Chat</DialogTitle>
              <DialogDescription>
                Simply enter another users email address to invite them to this
                chat:{' '}
                <span className="text-indigo-600 font-bold">
                  (Note: they must be registered)
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="johndoe@mail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="ml-auto sm:w-fit w-full">
                  Add To Chat
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <ShareLink
          isOpen={openInviteLink}
          setIsOpen={setOpenInviteLink}
          chatId={chatId}
        />
      </>
    )
  );
};
