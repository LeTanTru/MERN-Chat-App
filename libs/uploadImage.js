import cloudinary from './cloudinary.js';
import fs from 'fs/promises';

export const uploadImage = async (file, folder = 'uploads') => {
  if (!file || !file.path) {
    throw new Error('No file provided');
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder
    });

    await fs.unlink(file.path);

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    throw err;
  }
};
