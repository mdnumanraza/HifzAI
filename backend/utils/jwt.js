import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '5d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
};
