import cloudinary from '../libs/cloudinary.js';
import { generateToken, validateEmail } from '../libs/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import multer from 'multer';

const upload = multer({ dest: 'tmp/' });

export const signup = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Body cannot be empty!'
    });
  }
  try {
    const { fullName, email, password, profilePic } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).send({
        message: 'Full name, email and password are required!'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).send({
        message: 'Invalid email format!'
      });
    }

    if (password.length < 8) {
      return res.status(400).send({
        message: 'Password must be at least 8 characters long!'
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        message: 'Email already used!'
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).send({
        message: 'User created successfully!',
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic
        }
      });
    } else {
      return res.status(400).send({
        message: 'User could not be created!'
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'Some error occurred while creating the user.'
    });
  }
};

export const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Body cannot be empty!'
    });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: 'Email and password are required!'
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: 'Email is incorrect!'
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({
        message: 'Password is incorrect!'
      });
    }
    generateToken(user._id, res);
    return res.status(200).send({
      message: 'User logged in successfully!',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'Some error occurred while logging in.'
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 });
    return res.status(200).send({
      message: 'User logged out successfully!'
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'Some error occurred while logging out.'
    });
  }
};

export const updateProfile = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Body cannot be empty!'
    });
  }

  try {
    const { email, fullName, password, profilePic } = req.body;
    const userId = req.user._id;

    if (!email || !fullName) {
      return res.status(400).json({
        message: 'Email and full name are required!'
      });
    }

    const updateData = { email, fullName };

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters long!'
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    if (profilePic) {
      updateData.profilePic = profilePic;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true
    });

    if (!updatedUser) {
      return res.status(400).json({
        message: 'User could not be updated!'
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        profilePic: updatedUser.profilePic
      }
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || 'Some error occurred while updating the profile.'
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).send({
      message: 'User is authenticated!',
      user: req.user
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || 'Some error occurred while checking authentication.'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).send({
        message: 'User not found!'
      });
    }
    return res.status(200).send({
      message: 'User profile retrieved successfully!',
      user
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || 'Some error occurred while retrieving the profile.'
    });
  }
};
