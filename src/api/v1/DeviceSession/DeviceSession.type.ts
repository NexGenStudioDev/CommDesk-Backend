import { Types } from "mongoose";

// 1. Define the Location interface
interface ILocation {
  city?: string;
  region?: string;
  country?: string;
}

// 2. Define the main Session interface
export interface IDeviceSession {
  userId: Types.ObjectId;
  sessionId: string;
  deviceId: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ip?: string;
  location?: ILocation;
  userAgent?: string;
  refreshTokenHash: string;
  isActive: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
