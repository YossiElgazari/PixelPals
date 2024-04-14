import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = async (req: AuthRequest, res: Response,next: NextFunction) => {
  try {
    console.log("Protect:\n", req.headers);
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data: jwt.JwtPayload) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.sendStatus(401);
      }
      const id = data._id;
      req.user = { _id: id };
      return next();
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export type AuthRequest = Request & { user: { _id: string } };
