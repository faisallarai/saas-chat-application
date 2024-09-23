import { auth } from '@/auth';
import { chatMemberCollectionGroupRef } from '@/lib/converters/chat-members';
import { getDocs } from 'firebase/firestore';
import { ChatListRows } from './chat-list-rows';

export const ChatList = async () => {
  const session = await auth();

  console.log('chat list', session?.user.id);
  if (!session?.user.id) return;

  const chatsSnapshot = await getDocs(
    chatMemberCollectionGroupRef(session?.user.id)
  );

  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  return <ChatListRows initialChats={initialChats} />;
};
