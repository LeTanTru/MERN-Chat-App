import SidebarSkeleton from '@/components/skeleton/SidebarSkeleton';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { Users } from 'lucide-react';
import { useEffect } from 'react';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className='border-base-300 flex h-full w-20 flex-col border-r transition-all duration-200 lg:w-72'>
      <div className='border-base-300 w-full border-b p-5'>
        <div className='flex items-center gap-2'>
          <Users className='size-6' />
          <span className='hidden font-medium lg:block'>Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
      </div>
      <div className='overflow-y-auot w-full py-3'>
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`hover:bg-base-300 flex w-full items-center gap-3 p-3 transition-colors ${selectedUser?._id === user._id ? 'bg-base-300 ring-base-300 ring-1' : ''}`}
          >
            <div className='relative mx-auto lg:mx-0'>
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.fullName}
                className='size-12 rounded-full object-cover'
              />
              {onlineUsers && onlineUsers.includes(user._id) && (
                <span className='absolute right-0 bottom-0 rounded-full bg-green-500 ring-2 ring-zinc-900' />
              )}
            </div>

            <div className='hidden min-w-0 text-left lg:block'>
              <div className='truncate font-medium'>{user.fullName}</div>
              <div className='text-sm text-zinc-400'>
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
