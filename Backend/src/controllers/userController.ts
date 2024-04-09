import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import BaseController from './baseController';
import { IUser } from '../models/userModel';

interface ReqBody {
  username: string;
  email: string;
  password: string;
}

class UserController extends BaseController<IUser> {
    constructor() {
        super(User);
    }
  

    async register(req: Request, res: Response): Promise<void> {
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
    }
  
    async login(req: Request, res: Response): Promise<void> {
      try {
        const {username, password } = req.body as ReqBody;
        
        const user = await User.findOne({ username });
        if (!user) {
          res.status(401).json({ message: "Invalid username or password" });
          return;
        }
        
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          res.status(401).json({ message: "Invalid username or password" });
          return;
        }
        
        const token = jwt.sign({ "_id": user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ "token": token });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: "Error message", error: error.message });
        } else {
          res.status(500).json({ message: "An unknown error occurred" });
        }
      }
    }
  
    async logout(req: Request, res: Response): Promise<void> {
      try {
        res.status(200).json({ message: "User logged out successfully" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: "Error message", error: error.message });
        } else {
          res.status(500).json({ message: "An unknown error occurred" });
        }
      }
    }
}

export default new UserController();