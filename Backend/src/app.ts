import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import bodyParser from "body-parser";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import multer from "multer";

const env = dotenv.config();
if (env.error) {
  throw new Error("Failed to load the .env file");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const UPLOADS_URL = "http://192.168.1.23:3000/uploads/";
const DATABASE_URL = process.env.DATABASE_URL;
const app = express();


if (process.env.NODE_ENV == "development") {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "PixelPals API Backend",
        version: "1.0.1",
        description: "List all the routes of the backend REST API...",
      },
      servers: [
        {
          url: "http://localhost:" + process.env.PORT,
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

const initApp = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    mongoose.connect(DATABASE_URL).then(() => {
      app.post('/file/upload',  upload.single("file"), (req, res) => {
        if (!req.file) {
          // If no file is uploaded, return an error response
          return res.status(400).json({message: "No file uploaded"} );
        }
        // If file uploaded successfully, send a success response
        res.status(200).json({newfilename: UPLOADS_URL + req.file.originalname});
      });
      app.use(express.json());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/user", userRoutes);
      app.use("/post", postRoutes);
      app.use("/auth", authRoutes);
      app.use("/uploads", express.static("uploads"));
      resolve(app);
    })
  });
  return promise;
};

export default initApp;
