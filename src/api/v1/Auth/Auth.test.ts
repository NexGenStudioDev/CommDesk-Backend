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
import { AuthSchema } from "./Auth.model";

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

describe("Auth Model Schema", () => {
  it("should have required fields", () => {
    expect(AuthSchema.path("email")).toBeDefined();
    expect(AuthSchema.path("passwordHash")).toBeDefined();
    expect(AuthSchema.path("role")).toBeDefined();
    expect(AuthSchema.path("userId")).toBeDefined();
  });

  it("should enforce required validation", () => {
    expect(AuthSchema.path("email").options.required).toBe(true);
    expect(AuthSchema.path("passwordHash").options.required).toBe(true);
  });

  it("should enforce unique email", () => {
    expect(AuthSchema.path("email").options.unique).toBe(true);
  });

  it("should have correct role enum", () => {
    const roleEnum = AuthSchema.path("role").options.enum;
    const roleValues = Array.isArray(roleEnum)
      ? roleEnum
      : Object.values(roleEnum);

    expect(roleValues.sort()).toEqual(Object.values(ROLE_CONSTANT).sort());
  });

  it("should have correct defaults", () => {
    expect(AuthSchema.path("role").options.default).toBe(
      ROLE_CONSTANT.PARTICIPANT,
    );

    expect(AuthSchema.path("emailVerified").options.default).toBe(false);

    expect(AuthSchema.path("failedLoginAttempts").options.default).toBe(0);

    expect(AuthSchema.path("isBanned").options.default).toBe(false);
  });

  it("should have relation reference", () => {
    expect(AuthSchema.path("userId").options.ref).toBe("User");
  });

  it("should have refreshTokens subdocument array", () => {
    expect(AuthSchema.path("refreshTokens")).toBeDefined();
  });

  it("should have deviceSessions subdocument array", () => {
    expect(AuthSchema.path("deviceSessions")).toBeDefined();
  });

  it("should enable timestamps", () => {
    expect(AuthSchema.options.timestamps).toBe(true);
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
