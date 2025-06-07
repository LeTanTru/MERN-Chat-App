import ChatHeader from '@/components/ChatHeader';
import MessageInput from '@/components/MessageInput';
import MessageSkeleton from '@/components/skeleton/MessageSkeleton';
import { formatMessageTime } from '@/libs/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useRef } from 'react';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const { authUser } = useAuthStore();

  const lastMessageRef = useRef(null);
  const lastImageRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className='flex flex-1 flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
        {messages.map((message, index) => {
          const isLast = index === messages.length - 1;

          return (
            <div
              className={`chat ${
                message.senderId === authUser._id ? 'chat-end' : 'chat-start'
              }`}
              key={message._id}
              ref={isLast ? lastMessageRef : null}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || '/avatar.png'
                        : selectedUser.profilePic || '/avatar.png'
                    }
                    alt='profile pic'
                  />
                </div>
              </div>
              <div className='chat-header mb-1'>
                <time className='ml-1 text-xs opacity-50'>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className='chat-bubble flex flex-col'>
                {message.image && (
                  <img
                    ref={isLast ? lastImageRef : null}
                    src={message.image}
                    alt='Attachment'
                    className='mb-2 max-h-[200px] rounded-md sm:max-w-[200px]'
                    onLoad={() => {
                      if (lastMessageRef.current) {
                        lastMessageRef.current.scrollIntoView({
                          behavior: 'smooth'
                        });
                      }
                    }}
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
