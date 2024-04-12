import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";

interface ReqBody {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export interface AuthRequest extends Request {
  user?: { _id: string };
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
  //extract token from http header
  const authHeader = req.headers["authorization"];
  const refreshTokenOrig = authHeader && authHeader.split(" ")[1];

  if (refreshTokenOrig == null) {
    return res.status(401).send("missing token");
  }

  //verify token
  jwt.verify(
    refreshTokenOrig,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, userInfo: { _id: string }) => {
      if (err) {
        return res.status(403).send("invalid token");
      }

      try {
        const user = await User.findById(userInfo._id);
        if (
          user == null ||
          user.tokens == null ||
          !user.tokens.includes(refreshTokenOrig)
        ) {
          if (user.tokens != null) {
            user.tokens = [];
            await user.save();
          }
          return res.status(403).send("invalid token");
        }

        //generate new access token
        const { accessToken, refreshToken } = generateTokens(
          user._id.toString()
        );

        //update refresh token in db
        user.tokens = user.tokens.filter((token) => token != refreshTokenOrig);
        user.tokens.push(refreshToken);
        await user.save();

        //return new access token & new refresh token
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
    }
  );
};

const generateTokens = (
  userId: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    {
      _id: userId,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRATION,
    }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      salt: Math.random(),
    },
    process.env.REFRESH_TOKEN_SECRET
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
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

    if (user.tokens == null) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }
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

