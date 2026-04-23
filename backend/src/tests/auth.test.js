const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Student = require("../models/Student");

jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth API", () => {
  beforeEach(async () => {
    await Student.deleteMany({});
  });

  it("should register a new student", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("should not register a student with existing email", async () => {
    await Student.create({
      fullName: "Existing User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login a student", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Login User",
        email: "login@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should return profile of authenticated user", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Profile User",
        email: "profile@example.com",
        password: "password123",
      });

    const token = registerRes.body.data.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.email).toBe("profile@example.com");
  });
});
