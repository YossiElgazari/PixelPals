import { Response } from "express";
import User from "../models/userModel";
import BaseController from "./baseController";
import { IUser } from "../models/userModel";
import { AuthRequest } from "./authController";

interface ReqBody {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profilePicture?: string;
}

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getuserprofile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = (req.user as { _id: string })._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
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
      const userId = (req.user as { _id: string })._id;
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
