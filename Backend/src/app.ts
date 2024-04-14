import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import bodyParser from "body-parser";
import { Express } from "express";

const env = dotenv.config();
if (env.error) {
  throw new Error("Failed to load the .env file");
}

const DATABASE_URL = process.env.DATABASE_URL;
const app = express();

const initApp = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    mongoose.connect(DATABASE_URL).then(() => {
      app.use(express.json());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/user", userRoutes);
      app.use("/post", postRoutes);
      app.use("/auth", authRoutes);
      resolve(app);
    })
  });
  return promise;
};

export default initApp;
