import express from 'express';
import {
  checkAuth,
  getProfile,
  login,
  logout,
  signup,
  updateProfile
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import { uploadImageHandler } from '../controllers/upload.controller.js';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post(
  '/upload-image',
  protectRoute,
  upload.single('image'),
  uploadImageHandler
);

router.get('/profile', protectRoute, getProfile);

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);

export default router;
