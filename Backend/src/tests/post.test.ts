import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import init from "../app";
import User from "../models/userModel";
//import Post from "../models/postModel";

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
  username: "test",
  email: "test@test.com",
  password: "test",
  profilePicture: "test.jpg",
};

type TestPost = {
    content: string;
    _id?: string;
    owner?: string;
    photo?: string;
    likes?: string[];
    };

const post: TestPost = {
    content: "This is a test post",
};

beforeAll(async () => {
  app = await init();
  await User.deleteMany({ username: user.username });
  console.log("Before All");
});

afterAll(async () => {
  console.log("After All");
  await mongoose.connection.close();
});

describe("User Posts Tests (Register and login at first)", () => {
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

  test("Create Post", async () => {
    console.log("Create Post Test Start:\n", user);
    const res = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(post);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("content");
    post._id = res.body._id;
    console.log("\x1b[1m\x1b[35mPOST ID:\x1b[0m", post._id);
    post.owner = res.body.owner;
    post.photo = res.body.photo;
    post.likes = res.body.likes;
    console.log("Create Post Test Finish:\n", res.body);
  });

  test("Like Post", async () => {
    console.log("Like Post Test Start:\n", user);
    const res = await request(app)
      .put(`/post/like/${post._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    console.log("Like Post Test Finish:\n", res.body);
  });

  test("Unlike Post", async () => {
    console.log("Unlike Post Test Start:\n", user);
    const res = await request(app)
      .put(`/post/unlike/${post._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    console.log("Unlike Post Test Finish:\n", res.body);
  });

  test("Like Post", async () => {
    console.log("Like Post Test Start:\n", user);
    const res = await request(app)
      .put(`/post/like/${post._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    console.log("Like Post Test Finish:\n", res.body);
  });

  test("Get Post", async () => {
    console.log("Get Post Test Start:\n", user);
    const res = await request(app)
      .get(`/post/${post._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("content");
    console.log("Get Post Test Finish:\n", res.body);
  });

  test("Get All Posts", async () => {
    console.log("Get All Posts Test Start:\n", user);
    const res = await request(app)
      .get("/post")
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    console.log("Get All Posts Test Finish:\n", res.body);
  });

  test("Get User Posts", async () => {
    console.log("Get User Posts Test Start:\n", user);
    const res = await request(app)
      .get("/post/user")
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    console.log("Get User Posts Test Finish:\n", res.body);
  });

  test("Update Post", async () => {
    console.log("Update Post Test Start:\n", user);
    post.content = "This is an updated test post";
    const res = await request(app)
      .put(`/post/${post._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send(post);
    expect(res.statusCode).toEqual(200);
    console.log("Update Post Test Finish:\n", res.body);
  });

  test("Delete Post", async () => {
    console.log("Delete Post Test Start:\n", user);
    const res = await request(app)
      .delete(`/post/${post._id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);
    expect(res.statusCode).toEqual(200);
    console.log("Delete Post Test Finish:\n", res.body);
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
