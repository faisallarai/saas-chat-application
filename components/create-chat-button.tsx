'use client';

import { Button } from './ui/button';
import { MessageSquarePlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from './ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionStore } from '@/store/store';
import { v4 as uuidv4 } from 'uuid';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  addChatRef,
  chatMemberCollectionGroupRef,
} from '@/lib/converters/chat-members';
import { ToastAction } from './ui/toast';

export const CreateChatButton = ({ isLarge }: { isLarge?: boolean }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);

  const createNewChat = async () => {
    if (!session?.user.id) return;

    setLoading(true);
    toast({
      title: 'Creating new chat ...',
      description: 'Hold tight while we create your new chat...',
      duration: 3000,
    });

    const noOfChats = (
      await getDocs(chatMemberCollectionGroupRef(session.user.id))
    ).docs.map((doc) => doc.data()).length;

    // Check if user is pro and limit them creating new chat
    const isPro =
      subscription?.role === 'pro' && subscription.status === 'active';

    if (!isPro && noOfChats >= 3) {
      toast({
        title: 'Free plan limit exceeded',
        description:
          "You've exceeded the limit of chats for the FREE plan. Please upgrade to PRO to contiue adding users to chats!",
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

      setLoading(false);

      return;
    }
    const chatId = uuidv4();

    // chat/[chatId]/members/[userId]
    await setDoc(addChatRef(chatId, session.user.id), {
      userId: session.user.id!,
      email: session.user.email!,
      timestamp: serverTimestamp(),
      isAdmin: true,
      chatId: chatId,
      image: session.user.image || '',
    })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Your chat has been created!',
          className: 'bg-green-600 text-white',
          duration: 2000,
        });

        router.push(`/chat/${chatId}`);
      })
      .catch((error) => {
        console.error('create chat button', error);
        toast({
          title: 'Error',
          description: 'There was an error creating your chat!',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLarge)
    return (
      <div>
        <Button variant={'default'} onClick={createNewChat}>
          {loading ? <Spinner /> : 'Create a New Chat'}
        </Button>
      </div>
    );

  return (
    <Button variant={'ghost'} onClick={createNewChat}>
      <MessageSquarePlusIcon />
    </Button>
  );
};
