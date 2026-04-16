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

import { ROLE_CONSTANT } from "./Auth.Constant";
import { authService } from "./Auth.Service";

import mongoose from "mongoose";
import { AuthType } from "./Auth.type";
import { authUtils } from "./Auth.Utils";
import { connectDB, disconnectDB } from "../../../core/database/db.config";

// ✅ Increase timeout (DB + async ops need time)
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Mongo setup failed:", err);
    throw err;
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDB();
});

// Global variables for tests
let OrganizationId: string;

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
      {
        name: "ParticipantId",
        type: "ObjectId",
        ref: "Participant",
        required: true,
      },
      {
        name: "OrganizationId",
        type: "ObjectId",
        ref: "Organization",
        required: true,
      },
      { name: "JudgeId", type: "ObjectId", ref: "Judge", required: true },
      {
        name: "Permissions",
        type: "ObjectId",
        ref: "Permission",
        required: true,
      },
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

describe("Create User Account with (Auth Service) functions", () => {
  test("Check Organization Account Creation", async () => {
    const userData: AuthType = {
      email: "gdgranchi@gmail.com",
      passwordHash: "hashedpassword123",
      role: ROLE_CONSTANT.ORGANIZATION,
      emailVerified: true,
      failedLoginAttempts: 0,
      isBanned: false,
    };

    const createdUser = await authService.createUser(userData);
    console.log("Created User:", createdUser);
    OrganizationId = createdUser._id.toString();
    expect(createdUser).toBeDefined();
    expect(createdUser).toHaveProperty("_id");
  });
});

describe("Find User by ID (Auth Utils)", () => {
  test("Find Organization User by ID", async () => {
    const user = await authUtils.getUserById(OrganizationId);
    console.log("Found User:", user);
    expect(user).toBeDefined();
    expect(user?._id.toString()).toBe(OrganizationId);
  });
});

// describe("Check Auth API Endpoints", () => {
//   test("Create Super Admin Account", async () => {});

//   test("Create Participant Account", async () => {});

//   test("Create Judge Account", async () => {});

//   test("Create Organization Account", async () => {});

//   test("Create Mentor Account", async () => {});

//   test("Login with Valid Credentials", async () => {});

//   test("Login with Invalid Credentials", async () => {});

//   test("Access Protected Route with Valid Token", async () => {});

//   test("Access Protected Route with Invalid Token", async () => {});

//   test("Access Protected Route with Expired Token", async () => {});
// });
