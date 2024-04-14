import { Response } from "express";
import User from "../models/userModel";
import BaseController from "./baseController";
import { IUser } from "../models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";

interface ReqBody {
  username: string;
  email: string;
  password: string;
  oldPassword?: string;
  newPassword?: string;
  bio?: string;
  profilePicture?: string;
}

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getuserprofile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("getuserprofile error", error);
        res
          .status(500)
          .json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async updateuserprofile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const { username, email, bio, profilePicture } = req.body as ReqBody;
      user.username = username || user.username;
      user.email = email || user.email;
      user.bio = bio || user.bio;
      user.profilePicture = profilePicture || user.profilePicture;
      await user.save();
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("updateuserprofile error", error);
        res
          .status(500)
          .json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async updatepassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const { oldPassword, newPassword } = req.body as ReqBody;
      const isMatch = await user.isValidPassword(oldPassword);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
      user.passwordHash = newPassword;
      await user.save();
      res.status(200).json(user);
    } catch (error: unknown) {
      console.log("updatepassowrd error", error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async updateprofilepicture(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const { profilePicture } = req.body as ReqBody;
      user.profilePicture = profilePicture || user.profilePicture;
      await user.save();
      res.status(200).json(user);
    } catch (error: unknown) {
      console.log("updateprofilepicture error", error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
}

export default new UserController();
