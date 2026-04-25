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
import {
  connectDB,
  disconnectDB,
  DropDB,
} from "../../../core/database/db.config";
import { AuthSchema } from "./Auth.model";
import supertest, { Response } from "supertest";
import app from "../../../app";

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

export let OrganizationData = {
  owner: {
    firstName: "John", // First name of the community owner
    lastName: "Doe", // Last name of the community owner
    email: "john@example.com", // Email address of the owner
    primaryRole: "ADMIN", // The primary role of the owner in the community (can be "ADMIN", "MODERATOR", etc.)
    location: "Berlin", // The geographical location of the owner
    skills: ["React", "Node"], // Skills of the owner
    areaOfInterest: ["MENTORSHIP"], // The owner's area of interest
    internalNotes: "Speaker for React workshops", // Internal notes about the owner
    accessLevel: {
      internalDashboard: true, // Whether the owner has access to the internal dashboard
      communityForum: true, // Whether the owner has access to the community forum
      adminControls: false, // Whether the owner has admin control over the platform
      superAdmin: false, // Whether the owner has super admin privileges
    },
  },

  CommunityName: "Apex Circle", // Name of the community
  password: "securepassword123", // Password for community's account (hashed before saving)
  Bio: "Developer community focused on open source and hackathons", // Short description of the community
  City: "Ranchi", // City where the community is based
  ContactPhone: "6202665965", // Contact phone number for the community
  Country: "India", // Country where the community is located
  LogoUrl: "https://cdn.com/logo.png", // URL to the community's logo image
  OfficialEmail: "team@apexcircle.dev", // Official email of the community
  Website: "https://apexcircle.dev", // URL to the community's website

  socialLinks: {
    github: "https://github.com/apexcircle",
    discord: "https://discord.gg/apexcircle",
    twitter: "https://twitter.com/apexcircle",
  },
};

describe("Check Auth API Endpoints", () => {
  describe("Check Organization Api", () => {
    test("Test Create new Organization Api", async () => {
      const res: Response = await supertest(app)
        .post("/api/v1/signup/community")
        .send(OrganizationData);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.success).toBe(true);
      console.log("Create new Organization Test Done 😍");
    });
  });
});
