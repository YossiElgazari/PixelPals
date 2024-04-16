import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import init from "../app";
//import User from "../models/userModel";

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
  username: "admin",
  password: "admin",
  email: "admin@admin.com"
};

beforeAll(async () => {
  app = await init();
  console.log("Before All");
});

afterAll(async () => {
  console.log("After All");
  await mongoose.connection.close();
});

describe("User Authentication Tests", () => {

  test("Register User", async () => {
    console.log("Register User Test Start:\n", user);
    const res = await request(app)
      .post("/auth/register")
      .send(user);
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

  test("Get User Profile", async () => {
    console.log("Get User Profile Test Start:\n", user);
    const res = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${user.accessToken}`);
    console.log("Get User Profile Test:\n", res.body);
    expect(res.statusCode).toEqual(200);
    user.profilePicture = res.body.profilePicture;
    user.bio = res.body.bio;
    console.log("Get User Profile Test Finish:\n", res.body);
  });

  test("Update User Profile", async () => {
    console.log("Update User Profile Test Start:\n", user);
    const res = await request(app)
      .put("/user/profile")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        username: "newname",
        email: "yossi@newemail.com",
        bio: "This is a new bio",
      });
    expect(res.statusCode).toEqual(200);
    console.log("Update User Profile Test Finish:\n", res.body);
  });

  test("Update User Password", async () => {
    console.log("Update User Password Test Start:\n", user);
    const res = await request(app)
      .put("/user/reset-password")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ oldPassword: user.password, newPassword: "12345" });
    expect(res.statusCode).toEqual(200);
    console.log("Update User Password Test Finish:\n", res.body);
  });

  test("Logout User", async () => {
    console.log("Logout User Test Start:\n", user);
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ refreshToken: user.refreshToken });
    expect(res.statusCode).toEqual(200);
    console.log("Logout User Test Finish:\n", res.body);
  });

});
