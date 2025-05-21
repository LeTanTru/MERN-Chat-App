import { axiosInstance } from '@/libs/axios';
import { showErrorMessage, showSuccessMessage } from '@/libs/toast';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.user });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      showSuccessMessage({
        message: 'Account created successfully !'
      });
    } catch (error) {
      console.error('Error signing up:', error);
      showErrorMessage({
        message: error.response?.data?.message || 'Error signing up'
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      showSuccessMessage({
        message: 'Logged out successfully !'
      });
    } catch (error) {
      console.error('Error logging out:', error);
      showErrorMessage({
        message: error.response?.data?.message || 'Error logging out'
      });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      showSuccessMessage({
        message: 'Logged in successfully !'
      });
    } catch (error) {
      console.error('Error logging in:', error);
      showErrorMessage({
        message: error.response?.data?.message || 'Error logging in'
      });
    } finally {
      set({ isLoggingIn: false });
    }
  }
}));
