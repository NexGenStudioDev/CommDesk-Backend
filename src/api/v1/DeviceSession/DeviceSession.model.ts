import { Schema, model } from "mongoose";
import { IDeviceSession } from "./DeviceSession.type";

// 3. Create the Schema
const DeviceSessionSchema = new Schema<IDeviceSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true, unique: true },
    deviceId: { type: String, required: true },
    deviceName: String,
    browser: String,
    os: String,
    ip: String,
    userAgent: String,
    refreshTokenHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    location: {
      city: String,
      region: String,
      country: String,
    },
    lastActiveAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// 4. Export the Model
export const DeviceSession = model<IDeviceSession>(
  "DeviceSession",
  DeviceSessionSchema,
);
