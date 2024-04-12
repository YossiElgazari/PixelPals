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

const init = async (): Promise<Express> => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to the database");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/posts", postRoutes);

    return app;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

export default init;
