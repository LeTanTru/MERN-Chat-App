import SidebarSkeleton from '@/components/skeleton/SidebarSkeleton';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filterUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className='border-base-300 flex h-full w-20 flex-col border-r transition-all duration-200 lg:w-72'>
      <div className='border-base-300 w-full border-b p-5'>
        <div className='flex items-center gap-2'>
          <Users className='size-6' />
          <span className='hidden font-medium lg:block'>Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className='mt-3 hidden items-center gap-2 lg:flex'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              checked={showOnlineUsers}
              onChange={(e) => setShowOnlineUsers(e.target.checked)}
              className='checkbox checkbox-sm'
            />
            <span className='text-sm'>Show online only</span>
          </label>
          <span className='text-xs text-zinc-500'>
            ({onlineUsers.length - 1}) online
            {onlineUsers.length - 1 > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className='h-full w-full overflow-y-auto py-3'>
        {filterUsers.map((user) => (
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
              {onlineUsers.includes(user._id) && (
                <span className='absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-zinc-900' />
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
        {!filterUsers ||
          (filterUsers.length == 0 && (
            <div className='flex h-full w-full items-center justify-center p-3 text-sm text-zinc-500'>
              No users online
            </div>
          ))}
      </div>
    </aside>
  );
};
export default Sidebar;
