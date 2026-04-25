import mongoose from "mongoose";
import { ROLE_CONSTANT } from "./Auth.Constant";

export type DeviceSessionType = {
  deviceId: string;
  ip?: string;
  userAgent?: string;
  lastActiveAt?: Date;
};

export type RefreshTokenType = {
  token: string;
  expiresAt: Date;
  createdAt?: Date;
};

export type AuthType = {
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  role: string;

  // 🔐 Security
  failedLoginAttempts: number;
  loginAttemptsWindow?: Date;
  banExpiresAt?: Date;
  isBanned: boolean;

  lastLoginIP?: string;
  lastLoginUserAgent?: string;
  lastLoginAt?: Date;

  // 🔑 Tokens
  refreshTokens?: RefreshTokenType[];

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  activationToken?: string;

  // 🔗 Relation
  userId?: mongoose.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
};
