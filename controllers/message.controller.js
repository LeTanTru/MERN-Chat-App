import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../libs/socket.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }
    }).select('-password');
    res.status(200).json({
      message: 'Users fetched successfully',
      users: filteredUsers
    });
  } catch (error) {
    console.error('Error fetching users for sidebar:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      message: 'Messages fetched successfully',
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    console.log('🚀 ~ sendMessage ~ image:', image);
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image
    });
    const savedMessage = await newMessage.save();

    const receiverSocketid = getReceiverSocketId(receiverId);

    if (receiverSocketid) {
      io.to(receiverSocketid).emit('newMessage', newMessage);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      message: savedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
