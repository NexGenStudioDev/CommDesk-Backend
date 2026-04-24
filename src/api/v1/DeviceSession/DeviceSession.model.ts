import { Schema, model } from "mongoose";
import { IDeviceSession } from "./DeviceSession.type";

export const DeviceSessionSchema = new Schema<IDeviceSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      sparse: true, 
      unique: true,
    },

    deviceId: {
      type: String,
      required: true,
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
    },

    location: {
      city: String,
      region: String,
      country: String,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const DeviceSessionModel = model("DeviceSession", DeviceSessionSchema);
