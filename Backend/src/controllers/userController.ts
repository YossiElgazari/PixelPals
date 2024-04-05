import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

interface ReqBody {
  username: string;
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as ReqBody;

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    user = new User({
      username,
      email,
      passwordHash: password,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error message", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }  
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as ReqBody;
      
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
      
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
    
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.passwordHash = req.body.password;
      }
  
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }    
};
