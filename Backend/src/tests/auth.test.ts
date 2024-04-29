import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import init from "../app";
import User from "../models/userModel";
import Post from "../models/postModel";
import fs from "fs";

let app: Express;

type TestUser = {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  accessToken?: string;
  refreshToken?: string;
};

const user: TestUser = {
  username: "testUser",
  email: "test@test.com",
  password: "1234",
  profilePicture: "test.jpg",
};

beforeAll(async () => {
  app = await init();
  console.log("Before All");
  await User.deleteMany({ username: user.username });
});

afterAll(async () => {
  console.log("After All");
  await User.deleteMany({ username: user.username });
  await User.deleteMany({ username: "newname" });
  await Post.deleteMany({ content: "This is a test post" });
  await mongoose.connection.close();
});

describe("User Authentication Tests", () => {
  test("Register User", async () => {
    console.log("Register User Test:\n", user);
    const res = await request(app).post("/auth/register").send(user);
    expect(res.statusCode).toEqual(201);
    console.log("Register User Test Finish:\n", res.body);
  });

  test("Login User", async () => {
    console.log("Login User Test Start:\n", user);
    const res = await request(app)
      .post("/auth/login")
      .send({ username: user.username, password: user.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    console.log("Login User Test Finish:\n", res.body);
  });

  test("Token Expired", async () => {
    console.log("Token Expired Test Start:\n", user);
    console.log("Time out\n");
    await new Promise((r) => setTimeout(r, 5000)); // Delay to simulate token expiration
    const res = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).not.toEqual(200);
    console.log("Token Expired Test Finish:\n", res.body);
  }, 10000); // Increase timeout to 10000 milliseconds (10 seconds)

  test("Refresh Token", async () => {
    console.log("Refresh Token Test Start:\n", user);
    const res = await request(app)
      .get("/auth/refresh")
      .set({ Authorization: "Bearer " + user.refreshToken });
    expect(res.statusCode).toEqual(200);
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();
    console.log("Refresh Token Test Finish:\n", res.body);
  });

  test("upload file", async () => {
    console.log("Upload Photo Test Start:");
    const filePath = `${__dirname}/cat.jpg`;
    const rs = await fs.existsSync(filePath);
    if (rs) {
      const response = await request(app)
        .post("/file/upload")
        .attach("file", filePath);
      expect(response.statusCode).toEqual(200);
    }
  });

  test("Logout User", async () => {
    console.log("Logout User Test Start:\n", user);
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ refreshToken: user.refreshToken });
    console.log("Logout User Test Finish:\n", res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "User logged out successfully" });
  });
});
