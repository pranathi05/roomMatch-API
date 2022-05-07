import jwt from 'jsonwebtoken';
export const checkAuth = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
      error,
    });
  }
  next();
};
