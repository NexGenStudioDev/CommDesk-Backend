import { Schema, model, Types } from "mongoose";
import { nanoid } from "nanoid";

const DeviceSessionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      default: () => nanoid(),
      unique: true, // ✅ safe now (top-level field)
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    deviceName: String,
    browser: String,
    os: String,
    ip: String,
    userAgent: String,

    refreshTokenHash: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    location: {
      city: String,
      region: String,
      country: String,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

DeviceSessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const DeviceSession = model("DeviceSession", DeviceSessionSchema);
