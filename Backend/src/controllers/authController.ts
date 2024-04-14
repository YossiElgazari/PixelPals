import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";

interface ReqBody {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
}


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, profilePicture } = req.body as ReqBody;

    let user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    user = new User({
      username,
      email,
      passwordHash: password,
      profilePicture,
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

export const refresh = async (req: Request, res: Response) => {

  const refreshTokenOrig = req.header("authorization");

  if (!refreshTokenOrig) {
    return res.status(401).send("missing token");
  }

  jwt.verify(refreshTokenOrig, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo: { _id: string }) => {
    if (err) {
      console.error("Invalid token:", err);
      return res.status(403).send("Invalid token");
    }

    const user = await User.findById(userInfo._id);
    if (!user || !user.tokens.includes(refreshTokenOrig)) {
      return res.status(403).send("Invalid token");
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Replace the old refresh token with the new one
    user.tokens = user.tokens.filter(token => token !== refreshTokenOrig);
    if (user.tokens.length >= 5) {
      user.tokens.shift();  // Ensure the array does not exceed 5 tokens
    }
    user.tokens.push(refreshToken);
    await user.save();

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  });
};

const generateTokens = (userId: string): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });  // Example expiration
  const refreshToken = jwt.sign({ _id: userId, salt: Math.random() }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });  // Example expiration

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as ReqBody;

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
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    if (user.tokens.length >= 5) {
      user.tokens.shift();
    }
    user.tokens.push(refreshToken);
    await user.save();

    res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error message", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    const refreshToken = req.header("refreshToken");

    if (refreshToken) {
      user.tokens = user.tokens.filter(token => token !== refreshToken);
      await user.save();
      res.status(200).json({ message: "User logged out successfully" });
    } else {
      res.status(400).json({ message: "No refresh token provided" });
    }
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};


