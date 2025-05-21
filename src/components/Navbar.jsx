import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser === null) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className='bg-base-100 border-base-300 backdrop-blur-bg bg-base-100/80 fixed top-0 z-40 w-full border-b'>
      <div className='container mx-auto h-16 px-4'>
        <div className='flex h-full items-center justify-between'>
          <div className='flex items-center gap-8'>
            <Link
              to='/'
              className='flex items-center gap-2.5 transition-all hover:opacity-80'
            >
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg'>
                <MessageSquare className='text-primary size-5' />
              </div>
              <h1 className='text-lg font-bold'>Chatty</h1>
            </Link>
          </div>
          <div className='flex items-center gap-2'>
            <Link
              to={'/settings'}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className='h-4 w-4' />
              <span className='hidden sm:inline'>Settings</span>
            </Link>
            {authUser && (
              <>
                <Link to={'/profile'} className={`btn btn-sm gap-2`}>
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>

                <button
                  className='flex items-center gap-1'
                  onClick={handleLogout}
                >
                  <LogOut className='size-5' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
