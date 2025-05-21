import { axiosInstance } from '@/libs/axios';
import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: null,
  isMessagesLoading: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/message/users');
      set({ users: response.data.users });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ isUsersLoading: false });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data.messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ isMessagesLoading: false });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, response.data.message] });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}));
