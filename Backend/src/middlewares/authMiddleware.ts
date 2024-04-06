import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; 

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        res.status(401).json({ message: "Token has expired" });
        return;
      }

      // Add user to request object
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
