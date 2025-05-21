import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { X } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className='border-base-300 border-b p-2.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='avatar'>
            <div className='relative size-10 rounded-full'>
              <img
                src={selectedUser.profilePic || '/avatar.png'}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className='font-medium'>{selectedUser.fullName}</h3>
            <p className='text-base-content/70 text-sm'>
              {onlineUsers && onlineUsers.includes(selectedUser._id)
                ? 'Online'
                : 'Offline'}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
