import Navbar from '@/components/Navbar';
import PrivateRoute from '@/components/PrivateRoute';
import {
  HomePage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  SignUpPage
} from '@/pages';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Route, Routes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader className='size-10 animate-spin stroke-white' />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={<PrivateRoute element={<HomePage />} />} />

        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/profile'
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route
          path='/settings'
          element={<PrivateRoute element={<SettingsPage />} />}
        />
      </Routes>
      {createPortal(
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          transition={Bounce}
        />,
        document.body
      )}
    </div>
  );
};
export default App;
