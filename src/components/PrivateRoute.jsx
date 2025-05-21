import { useAuthStore } from '@/store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const PrivateRoute = ({ element }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader className='size-10 animate-spin stroke-white' />
      </div>
    );
  }

  return authUser ? element : <Navigate to='/login' replace />;
};

export default PrivateRoute;
