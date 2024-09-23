'use client';

import {
  chatMemberCollectionGroupRef,
  ChatMembers,
} from '@/lib/converters/chat-members';
import { MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { CreateChatButton } from './create-chat-button';
import { ChatListRow } from './chat-list-row';

export const ChatListRows = ({
  initialChats,
}: {
  initialChats: ChatMembers[];
}) => {
  const { data: session } = useSession();

  const [members, loading, error] = useCollectionData<ChatMembers>(
    session && chatMemberCollectionGroupRef(session.user.id),
    {
      initialValue: initialChats,
    }
  );

  if (members?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center pt-40 space-y-2">
        <MessageSquare className="h-10 w-10" />
        <h1 className="text-5xl font-extralight">Welcome!</h1>
        <h2 className="pb-10">
          Lets got you started by creating your first chat!
        </h2>
        <CreateChatButton isLarge />
      </div>
    );
  }
  return (
    <div>
      {members?.map((member) => (
        <ChatListRow key={member.chatId} chatId={member.chatId} />
      ))}
    </div>
  );
};
