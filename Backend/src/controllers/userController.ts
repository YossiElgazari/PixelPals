import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import { IUser } from '../models/userModel';
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
      res.status(200).send({ "token": token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
    
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error message", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export type AuthRequest = Request & { user: { _id: string } };

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token,process.env.JWT_SECRET, (err, data: jwt.JwtPayload) => {
    if (err) {
      return res.sendStatus(403);
    }
    const id = data.userId;
    req.user = { _id: id} as IUser;
    return next();
  })
}

