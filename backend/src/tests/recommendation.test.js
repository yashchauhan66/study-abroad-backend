const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Student = require("../models/Student");
const Program = require("../models/Program");
const University = require("../models/University");

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

describe("Recommendation API", () => {
  let student;
  let university;
  let program;

  beforeEach(async () => {
    await Student.deleteMany({});
    await Program.deleteMany({});
    await University.deleteMany({});

    student = await Student.create({
      fullName: "Rec User",
      email: "rec@example.com",
      password: "password123",
      targetCountries: ["USA"],
      interestedFields: ["Computer Science"],
      maxBudgetUsd: 50000,
      preferredIntake: "Fall 2024",
      englishTest: { exam: "IELTS", score: 7.5 }
    });

    university = await University.create({
      name: "Test University",
      country: "USA",
      city: "New York"
    });

    program = await Program.create({
      university: university._id,
      universityName: university.name,
      country: "USA",
      city: "New York",
      title: "MS in Computer Science",
      field: "Computer Science",
      degreeLevel: "master",
      tuitionFeeUsd: 45000,
      intakes: ["Fall 2024"],
      minimumIelts: 6.5
    });
  });

  it("should return recommendations for a student", async () => {
    const res = await request(app)
      .get(`/api/recommendations/${student._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.recommendations.length).toBeGreaterThan(0);
    expect(res.body.data.recommendations[0].title).toBe("MS in Computer Science");
    expect(res.body.data.recommendations[0].matchScore).toBe(100); // 35+30+20+10+5
  });
});
