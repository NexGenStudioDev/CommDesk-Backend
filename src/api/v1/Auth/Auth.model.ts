import mongoose from "mongoose";
import { ROLE_CONSTANT } from "./Auth.Constant";

let AuthSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLE_CONSTANT),
      default: ROLE_CONSTANT.PARTICIPANT,
    },
    emailVerified: { type: Boolean, default: false },

    failedLoginAttempts: { type: Number, default: 0 },

    ParticipantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
    OrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    JudgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Judge",
    },
    Permissions: {
      type: mongoose.Schema.ObjectId,
      ref: "Permission",
    },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export let AuthModel = mongoose.model("Auth", AuthSchema);
