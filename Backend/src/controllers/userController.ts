import { Response } from "express";
import User from "../models/userModel";
import BaseController from "./baseController";
import { IUser } from "../models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";
import Follower from "../models/followerModel";
import Post from "../models/postModel";

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
      const postsCount = await Post.countDocuments({ user: userId });
      const followersCount = await Follower.countDocuments({ following: userId });
      const followingCount = await Follower.countDocuments({ user: userId });
      res.status(200).json({
        user,
        postsCount,
        followersCount,
        followingCount
      });
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

  async getuserprofilebyid(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      console.log("userId", userId);
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const postsCount = await Post.countDocuments({ user: userId });
      const followersCount = await Follower.countDocuments({ following: userId });
      const followingCount = await Follower.countDocuments({ user: userId });
      res.status(200).json({
        user,
        postsCount,
        followersCount,
        followingCount
      });
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.log("getuserprofilebyid error", error);
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

  async getuserbyid(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      console.log("sending user", user);
      res.status(200).json(user);
    } catch (error: unknown) {
      console.log("getuserbyid error", error);
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      await Post.deleteMany({ user: userId });
      await Follower.deleteMany({ $or: [{ user: userId }, { following: userId }] });


      await User.deleteOne({ _id: userId });

      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.log("deleteuser error", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "Error message", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async searchusers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const query = req.params.query;
      const users = await User.find({
        username: { $regex: `^${query}`, $options: "i" }, 
      })
      .select("_id username profilePicture")
      .limit(10)
      .sort({ username: 1 });
  
      if (users.length === 0) {
        res.status(404).json({ message: "No users found" });
        return;
      }
  
      res.status(200).json(users);
    } catch (error: unknown) {
      console.error("searchUsers error", error);
      if (error instanceof Error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
  

  async followUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user._id; // The authenticated user's ID
    const { userId: followUserId } = req.params; // The user to follow

    try {
      if (userId === followUserId) {
        res.status(400).json({ message: "You cannot follow yourself" });
        return;
      }

      const alreadyFollowing = await Follower.findOne({
        user: userId,
        following: followUserId,
      });

      if (alreadyFollowing) {
        res.status(409).json({ message: "Already following this user" });
        return;
      }

      const newFollow = new Follower({
        user: userId,
        following: followUserId,
      });

      await newFollow.save();
      res.status(201).json({ message: "Successfully following user" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error following user", error: error.message });
    }
  }

  async unfollowUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user._id; // The authenticated user's ID
    const { userId: followUserId } = req.params; // The user to unfollow

    try {
      const follow = await Follower.findOneAndDelete({
        user: userId,
        following: followUserId,
      });

      if (!follow) {
        res.status(404).json({ message: "Not following this user" });
        return;
      }

      res.status(200).json({ message: "Successfully unfollowed user" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error unfollowing user", error: error.message });
    }
  }

  async getFollowers(req: AuthRequest, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const followers = await Follower.find({ following: userId }).populate(
        "user",
        "username profilePicture"
      );
      const followersofuser = followers.map((follower) => follower.user);
      console.log("\x1b[36mfollowersofuser:\n", followersofuser, "\x1b[0m");
      res.status(200).json(followersofuser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving followers", error: error.message });
    }
  }

  async getFollowing(req: AuthRequest, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const following = await Follower.find({ user: userId }).populate(
        "following",
        "username profilePicture"
      );
      res.status(200).json(following.map((follower) => follower.following));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving following", error: error.message });
    }
  }
}

export default new UserController();
