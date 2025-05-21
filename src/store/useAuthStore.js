import { axiosInstance } from '@/libs/axios';
import { showErrorMessage, showSuccessMessage } from '@/libs/toast';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data.user });
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
      set({ authUser: res.data.user });
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
      set({ authUser: res.data.user });
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
  },

  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axiosInstance.post('/auth/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccessMessage({
        message: 'Image uploaded successfully!'
      });

      return res.data; // { url, public_id }
    } catch (error) {
      console.error('Error uploading image:', error);
      showErrorMessage({
        message: error.response?.data?.message || 'Image upload failed'
      });
      return null;
    }
  },

  updateProfile: async (data) => {}
}));
