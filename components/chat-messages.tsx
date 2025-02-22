'use client';

import { Message, sortedMessagesRef } from '@/lib/converters/message';
import { useLanguageStore } from '@/store/store';
import { MessageCircleIcon } from 'lucide-react';
import { Session } from 'next-auth';
import React, { createRef, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { UserAvatar } from './user-avatar';
import LoadingSpinner from './loading-spinner';

interface ChatMessagesProps {
  chatId: string;
  session: Session | null;
  initialMessages: Message[];
}
export const ChatMessages = ({
  chatId,
  session,
  initialMessages,
}: ChatMessagesProps) => {
  const language = useLanguageStore((state) => state.language);
  const messagesEndRef = createRef<HTMLDivElement>();

  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessagesRef(chatId),
    {
      initialValue: initialMessages,
    }
  );

  if (error) console.error('chat messages', error);

  // if any message change, scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    return () => {
      console.log('cleaning stuffs');
    };
  }, [messages, messagesEndRef]);

  return (
    <div className="p-5">
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col justify-center items-center text-center p-20 rounded-xl space-y-2 bg-indigo-400 text-white font-extralight">
          <MessageCircleIcon className="h-10 w-10" />
          <h2>
            <span className="font-bold">Invite a friend</span> &{' '}
            <span className="font-bold">
              Send your first message in ANY language
            </span>{' '}
            below to get started!
          </h2>
          <p>The AI will auto-detect & translate it all for you</p>
        </div>
      )}

      {messages?.map((message) => {
        // message sender is equivalent to the one who loggedin
        const isSender = message.user.id === session?.user.id;

        return (
          <div key={message.id} className="flex my-2 items-end">
            <div
              className={`flex flex-col relative space-y-2 p-4 w-fit line-clamp-1 mx-2 rounded-lg ${
                isSender
                  ? 'ml-auto bg-violet-600 text-white rounded-br-none'
                  : 'bg-gray-100 dark:text-gray-100 dark:bg-slate-700 rounded-bl-none'
              }`}
            >
              <p
                className={`text-xs italic font-extralight line-clamp-1 ${
                  isSender ? 'text-right' : 'text-left'
                }`}
              >
                {message.user.name.split(' ')[0]}
              </p>

              <div className="flex space-x-2">
                <p>{message.translated?.[language] || message.input}</p>
                {language !== 'en' && !message.translated && <LoadingSpinner />}
              </div>
            </div>

            <UserAvatar
              name={message.user.name}
              image={message.user.image}
              className={`${!isSender && '-order-1'}`}
            />
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};
