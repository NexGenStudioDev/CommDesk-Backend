import mongoose from "mongoose";
import { AuthType } from "./Auth.type";
import { ROLE_CONSTANT } from "./Auth.Constant";

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const AuthSchema = new mongoose.Schema<AuthType>(
  {
    // 🔑 Identity
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      enum: ROLE_CONSTANT,
      default: ROLE_CONSTANT.PARTICIPANT,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // 🔐 Security (Login Protection)
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    loginAttemptsWindow: {
      type: Date,
    },

    banExpiresAt: {
      type: Date,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    lastLoginIP: String,
    lastLoginUserAgent: String,
    lastLoginAt: Date,

    // 🔑 Token System
    refreshTokens: [RefreshTokenSchema],

    passwordResetToken: String,
    passwordResetExpires: Date,

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    activationToken: String,

    // 🔐 Device Sessions (multi-device support)
    deviceSessions: [DeviceSessionSchema],

    // 🔗 Relation (VERY IMPORTANT)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 Indexes (Performance + Security)
AuthSchema.index({ email: 1 });
AuthSchema.index({ userId: 1 });
AuthSchema.index({ "refreshTokens.token": 1 });

export const AuthModel = mongoose.model("Auth", AuthSchema);
