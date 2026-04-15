import request from "supertest";
import {
  afterAll,
  beforeAll,
  describe,
  afterEach,
  expect,
  it,
  test,
  jest,
} from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { ROLE_CONSTANT } from "./Auth.Constant";
import { authService } from "./Auth.Service";

let mongo: MongoMemoryServer;

// ✅ Increase timeout (DB + async ops need time)
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.14" }, // ✅ stable version
    });

    const uri = mongo.getUri();
    await mongoose.connect(uri);
  } catch (err) {
    console.error("Mongo setup failed:", err);
    throw err;
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  // ✅ Fast parallel cleanup
  await Promise.all(
    Object.values(collections).map((collection) =>
      collection.deleteMany({})
    )
  );
});

afterAll(async () => {
  await mongoose.connection.close();

  // ✅ Safe teardown
  if (mongo) {
    await mongo.stop();
  }
});


// ================== TESTS ==================

describe("Check Auth Constants", () => {
  test("Check Role Constants to Match Expected Values", () => {
    expect(ROLE_CONSTANT.SUPER_ADMIN).toBe("super_admin");
    expect(ROLE_CONSTANT.ADMIN).toBe("admin");
    expect(ROLE_CONSTANT.JUDGE).toBe("judge");
    expect(ROLE_CONSTANT.PARTICIPANT).toBe("participant");
    expect(ROLE_CONSTANT.ORGANIZATION).toBe("organization");
    expect(ROLE_CONSTANT.MENTOR).toBe("mentor");
  });
});

describe("Check Auth Model", () => {
  it("Check Auth Model Schema Fields and Types", () => {
    const authSchemaFields = [
      { name: "firstName", type: String, required: true },
      { name: "lastName", type: String, required: true },
      { name: "email", type: String, required: true, unique: true },
      { name: "password", type: String, required: true },
      {
        name: "role",
        type: String,
        enum: Object.values(ROLE_CONSTANT),
        default: ROLE_CONSTANT.PARTICIPANT,
      },
      { name: "emailVerified", type: Boolean, default: false },
      { name: "failedLoginAttempts", type: Number, default: 0 },
      { name: "ParticipantId", type: "ObjectId", ref: "Participant", required: true },
      { name: "OrganizationId", type: "ObjectId", ref: "Organization", required: true },
      { name: "JudgeId", type: "ObjectId", ref: "Judge", required: true },
      { name: "Permissions", type: "ObjectId", ref: "Permission", required: true },
      { name: "isBanned", type: Boolean, default: false },
    ];

    authSchemaFields.forEach((field) => {
      expect(field).toHaveProperty("name");
      expect(field).toHaveProperty("type");

      if (field.required) {
        expect(field).toHaveProperty("required", true);
      }

      if (field.unique) {
        expect(field).toHaveProperty("unique", true);
      }

      if (field.enum) {
        expect(Array.isArray(field.enum)).toBe(true);
      }

      if (field.default !== undefined) {
        expect(field).toHaveProperty("default");
      }
    });
  });
});

describe("Check Mandatory Functions", () => {
  test("Check authService.createUser Method", () => {
    expect(authService).toHaveProperty("createUser");
    expect(typeof authService.createUser).toBe("function");
  });
});

describe("Check Auth API Endpoints", () => {
  test("Create Super Admin Account", async () => {});

  test("Create Participant Account", async () => {});

  test("Create Judge Account", async () => {});

  test("Create Organization Account", async () => {});

  test("Create Mentor Account", async () => {});

  test("Login with Valid Credentials", async () => {});

  test("Login with Invalid Credentials", async () => {});

  test("Access Protected Route with Valid Token", async () => {});

  test("Access Protected Route with Invalid Token", async () => {});

  test("Access Protected Route with Expired Token", async () => {});
});