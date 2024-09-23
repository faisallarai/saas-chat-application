import { ChatList } from '@/components/chat-list';
import { ChatPermissionError } from '@/components/chat-permission-error';

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};

const ChatsPage = ({ searchParams: { error } }: Props) => {
  return (
    <div>
      {error && (
        <div className="m-2">
          <ChatPermissionError />
        </div>
      )}

      <ChatList />
    </div>
  );
};

export default ChatsPage;
