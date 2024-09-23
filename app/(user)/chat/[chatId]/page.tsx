import { auth } from '@/auth';
import AdminControls from '@/components/admin-controls';
import { ChatInput } from '@/components/chat-input';
import { ChatMembersBadges } from '@/components/chat-members-badges';
import { ChatMessages } from '@/components/chat-messages';
import { chatMembersRef } from '@/lib/converters/chat-members';
import { sortedMessagesRef } from '@/lib/converters/message';
import { getDocs } from 'firebase/firestore';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await auth();

  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => doc.data()
  );

  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs
    .map((doc) => doc.id)
    .includes(session?.user.id!);

  if (!hasAccess) redirect('/chat?error=permission');

  return (
    <>
      {/* Admin controls */}
      <AdminControls chatId={chatId} />
      {/* ChatMembersBadge */}
      <ChatMembersBadges chatId={chatId} />

      {/* ChatMessages */}
      <div className="flex-1">
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>
      {/* ChatInput */}
      <ChatInput chatId={chatId} />
    </>
  );
};

export default ChatPage;
