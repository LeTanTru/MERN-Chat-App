import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.envs.NODE_ENV !== 'development',
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  return token;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
