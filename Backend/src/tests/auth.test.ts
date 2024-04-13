import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import init from "../app";
import User from "../models/userModel";
import Post from "../models/postModel";

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
  bio: "This is a test user",
};

beforeAll(async () => {
  app = await init();
  console.log("Before All");
  await User.deleteMany({ username: user.username });
});

afterAll(async () => {
  console.log("After All");
  await User.deleteMany({ username: user.username });
  await Post.deleteMany({ content: "This is a test post" });
  await User.deleteMany({ username: "newname"})
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

  test("Get User Porfile", async () => {
    console.log("Get User Profile Test Start:\n", user);
    const res = await request(app)
      .get("/user/profile")
      .set("authorization", `${user.accessToken}`);
    console.log("Get User Profile Test:\n", res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("bio");
    console.log("Get User Profile Test Finish:\n", res.body);
  });

  test("Update User Profile", async () => {
    console.log("Update User Profile Test Start:\n", user);
    const res = await request(app)
      .put("/user/profile")
      .set("authorization", `${user.accessToken}`)
      .send({
        username: "newname",
        email: "yossi@newemail.com",
        bio: "This is a new bio",
      });
    console;
    expect(res.statusCode).toEqual(200);
    console.log("Update User Profile Test Finish:\n", res.body);
  });

  test("Update User Password", async () => {
    console.log("Update User Password Test Start:\n", user);
    const res = await request(app)
      .put("/user/resetpassword")
      .set("authorization", `${user.accessToken}`)
      .send({ password: "12yossi345" });
    expect(res.statusCode).toEqual(200);
    console.log("Update User Password Test Finish:\n", res.body);
  });

  test("Create Post", async () => {
    console.log("Create Post Test Start:\n", user);
    const res = await request(app)
      .post("/post")
      .set("authorization", `${user.accessToken}`)
      .send({ content: "This is a test post" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("content");
    console.log("Create Post Test Finish:\n", res.body);
  });

  test("Refresh Token", async () => {
    console.log("Refresh Token Test Start:\n", user);
    const res = await request(app)
      .get("/auth/refresh")
      .set("authorization", `${user.accessToken}`)
      .send();
    expect(res.statusCode).toBe(200);
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    console.log("Refresh Token Test Finish:\n", res.body);
  });

  test("Logout User", async () => {
    console.log("Logout User Test Start:\n", user);
    const res = await request(app)
      .get("/user/logout")
      .set("authorization", `${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "User logged out successfully" });
    console.log("Logout User Test Finish:\n", res.body);
  });
});
