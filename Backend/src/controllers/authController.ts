import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";
import crypto from "crypto";

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
  console.log("Refreshing token", req.header("Authorization"));
  const refreshTokenOrig = req.header("Authorization")?.split(" ")[1];
  if (!refreshTokenOrig) {
    return res.status(401).send("Missing token");
  }
  jwt.verify(refreshTokenOrig, process.env.REFRESH_TOKEN_SECRET, async (err, decodedToken: { _id: string }) => {
    if (err) {
      return res.status(403).send("Invalid or Expired Token");
    }
    try {
      const user = await User.findById(decodedToken._id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (!user.tokens.includes(refreshTokenOrig)) {
        return res.status(403).send("Token misuse detected");
      }

      // Generating new tokens
      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      // Securely replace the old refresh token
      user.tokens = user.tokens.filter(token => token !== refreshTokenOrig);  // Remove the old refresh token
      user.tokens.push(refreshToken);  // Add the new refresh token
      await user.save();

      res.status(200).send({ accessToken, refreshToken });
    } catch (err) {
      console.error("Error refreshing token:", err);
      res.status(500).send("Error refreshing token");
    }
  });
};


const generateTokens = (userId: string): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });

  const refreshToken = jwt.sign(
    { _id: userId, salt: crypto.randomBytes(16).toString('hex') },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

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
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "No access token provided" });
    }

    user.tokens = user.tokens.filter(token => token !== refreshToken);
    await user.save();
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "An error occurred during logout", error: error.message });
  }
};

