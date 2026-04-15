import mongoose from "mongoose";

export type AuthType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  emailVerified: boolean;
  failedLoginAttempts: number;
  ParticipantId?: mongoose.Types.ObjectId;
  OrganizationId?: mongoose.Types.ObjectId;
  JudgeId?: mongoose.Types.ObjectId;
  Permissions?: mongoose.Types.ObjectId;
  isBanned: boolean;
};
