import mongoose from "mongoose";
import { MemberType } from "./Member.type";
import { ROLE_CONSTANT } from "../Auth/Auth.Constant";

let MemberSchema = new mongoose.Schema<MemberType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  publicProfileUrl: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  membershipStatus: {
    type: String,
    enum: ["On Boarding", "inactive", "Active", "Suspended", "Banned"],
    default: "On Boarding",
  },
  onboardingSource: {
    type: String,
    enum: [
      "website",
      "referral",
      "social_media",
      "event",
      "direct_invitation",
      "other",
    ],
    default: "website",
  },

  AuthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
    index: true,
  },

  primaryRole: {
    type: String,
    enum: ROLE_CONSTANT,
    default: ROLE_CONSTANT.PARTICIPANT,
  },

  location: { type: String },
  skills: [{ type: String }],
  areaOfInterest: [{ type: String }],
  internalNotes: { type: String },
});

export const MemberModel = mongoose.model<MemberType>("Member", MemberSchema);
