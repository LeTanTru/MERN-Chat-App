import { axiosInstance } from '@/libs/axios';
import { showErrorMessage } from '@/libs/toast';
import { useAuthStore } from '@/store/useAuthStore';
import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/message/users');
      set({ users: response.data.users });
    } catch (error) {
      console.error('Error fetching users:', error);
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
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] }); // clear messages when selecting new user
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      set({ isMessageSending: true });
      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, response.data.message] });
    } catch (error) {
      console.error('Error sending message:', error);
      showErrorMessage({
        message: error.response?.data?.message || 'Error sending message'
      });
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    if (!socket || !selectedUser) return;

    socket.on('newMessage', (newMessage) => {
      const { messages } = get();
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off('newMessage');
  }
}));
