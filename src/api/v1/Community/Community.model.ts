import { Mongoose, Schema } from "mongoose";
import type { CommunitySchema } from "./Community.Type";

const communitySchema = new Schema<CommunitySchema>({
  OwnerID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  CommunityName: { type: String, required: true },
  Bio: { type: String, required: true },
  Slug: { type: String, required: true, unique: true }, 
  Website: { type: String, required: true },
  Country: { type: String, required: true },
  City: { type: String, required: true },
  OfficialEmail: { type: String, required: true },
  ContactPhone: { type: String, required: true },
  LogoUrl: { type: String, required: true },

  SocialLinks: {
    github: { type: String },
    discord: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    instagram: { type: String },
  },

  Status: {
    type: String,
    enum: ["pending", "under_review", "approved", "active"],
    default: "pending",
  },
  Members: [{ type: Schema.Types.ObjectId, ref: "Member" }], // Array of Member IDs
  Judges: [{ type: Schema.Types.ObjectId, ref: "Judge" }], // Array of Judge IDs
});

export const CommunityModel = (mongoose: Mongoose) =>
  mongoose.model<CommunitySchema>("Community", communitySchema);
