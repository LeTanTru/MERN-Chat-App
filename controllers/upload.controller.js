import { uploadImage } from '../libs/uploadImage.js';

export const uploadImageHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const result = await uploadImage(req.file, 'profile_pics');

    return res.status(200).json({
      message: 'Upload successful!',
      url: result.url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    return res.status(500).json({
      message: error.message || 'Image upload failed.'
    });
  }
};
