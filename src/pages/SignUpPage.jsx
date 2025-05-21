import AuthImagePattern from '@/components/AuthImagePattern';
import { showErrorMessage, showSuccessMessage } from '@/libs/toast';
import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff, Loader2, Mail, MessageSquare, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const { signup, authUser, isSigningUp } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    const { fullName, email, password } = formData;
    if (!fullName) {
      showErrorMessage({ message: 'Full name is required' });
      return false;
    }
    if (!email) {
      showErrorMessage({ message: 'Email is required' });
      return false;
    }
    if (!password) {
      showErrorMessage({ message: 'Password is required' });
      return false;
    }
    if (password.length < 8) {
      showErrorMessage({
        message: 'Password must be at least 8 characters long'
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showErrorMessage({ message: 'Email is invalid' });
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    }
  };

  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      <div className='flex flex-col items-center justify-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='mb-8 text-center'>
            <div className='group flex flex-col items-center gap-2'>
              <div className='bg-primary/10 group-hover:bg-primary/20 flex size-12 items-center justify-center rounded-xl transition-colors'>
                <MessageSquare className='text-primary size-6' />
              </div>
              <h1 className='mt-2 text-2xl font-bold'>Create an Account</h1>
              <p className='text-base-content/60'>
                Get started with your free account
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text mb-2 ml-2 font-medium'>
                  Full Name
                </span>
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3'>
                  <User className='text-base-content/40 h-5 w-5' />
                </div>
                <input
                  type='text'
                  className={
                    'text-md block w-full rounded-lg border border-gray-500 p-2.5 pl-10 text-gray-300 transition-all focus:border-blue-500 focus:ring-blue-500'
                  }
                  placeholder='John Doe'
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text mb-2 ml-2 font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3'>
                  <Mail className='text-base-content/40 h-5 w-5' />
                </div>
                <input
                  type='text'
                  className={
                    'text-md block w-full rounded-lg border border-gray-500 p-2.5 pl-10 text-gray-300 transition-all focus:border-blue-500 focus:ring-blue-500'
                  }
                  placeholder='example@gmail.com'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text mb-2 ml-2 font-medium'>
                  Password
                </span>
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3'>
                  <Mail className='text-base-content/40 h-5 w-5' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={
                    'text-md block w-full rounded-lg border border-gray-500 p-2.5 pl-10 text-gray-300 transition-all focus:border-blue-500 focus:ring-blue-500'
                  }
                  placeholder='Password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type='bottom'
                  className='absolute inset-y-0 right-0 z-10 flex items-center pr-3 transition-all ease-linear'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='text-base-content/40 h-5 w-5 transition-all ease-linear' />
                  ) : (
                    <Eye className='text-base-content/40 h-5 w-5 transition-all ease-linear' />
                  )}
                </button>
              </div>
            </div>
            <button
              type='submit'
              className='btn btn-primary w-full rounded-lg'
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account?{' '}
              <Link to='/login' className='text-primary underline'>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title='Join our community'
        subtitle='Connect with friends, share moments, and stay in touch with your loved ones.'
      />
    </div>
  );
};
export default SignUpPage;
