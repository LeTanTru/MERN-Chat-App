import { axiosInstance } from '@/libs/axios';
import { showErrorMessage, showSuccessMessage } from '@/libs/toast';
import { io } from 'socket.io-client';
import { create } from 'zustand';

const BASE_URL = 'http://localhost:8000';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data.user });
      get().connectSocket();
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
      get().disconnectSocket();
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
      get().connectSocket();
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

  updateProfile: async (data) => {},

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();
    set({ socket: socket });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  }
}));
