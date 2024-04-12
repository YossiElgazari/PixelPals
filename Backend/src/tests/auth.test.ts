import request from "supertest";
import { App } from "supertest/types";
import mongoose from "mongoose";
import init from "../app";

type TestUser = {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  token?: string;
};

const user: TestUser = {
  username: "testUser",
  email: "test@test.com",
  password: "1234",
  bio: "This is a test user",
};

let app: App;
beforeAll(async () => {
  app = await init();
  console.log("Before All");
  await mongoose.connect(process.env.DATABASE_URL!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Authentication Tests", () => {
  test("Register User", async () => {
    const res = await request(app).post("/user/register").send(user);
    expect(res.statusCode).toEqual(201);
  });

  test("Login User", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ username: user.username, password: user.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    user.token = res.body.token;
  });

  test("Get User Porfile", async () => {
    const res = await request(app)
      .get("/user")
      .set("authorization", `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("bio");
  });

  test("Update User Profile", async () => {
    const res = await request(app)
      .put("/user")
      .set("authorization", `Bearer ${user.token}`)
      .send({ username: "newname", email: "yossi@newemail" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("email");
  });

  test("Create Post", async () => {
    const res = await request(app)
      .post("/post")
      .set("authorization", `Bearer ${user.token}`)
      .send({ content: "This is a test post" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("content");
  });

  test("Logout User", async () => {
    const res = await request(app)
      .get("/users/logout")
      .set("authorization", `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "User logged out successfully" });
  });
});
