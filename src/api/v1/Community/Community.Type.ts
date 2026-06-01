import mongoose from "mongoose";

export type CommunitySchema = {
  OwnerID?: String; // Reference to the User who owns the community
  CommunityName: string;
  Bio: string;
  Slug: string;
  Website: string;
  Country: string;
  City: string;
  OfficialEmail: string;
  ContactPhone: string;
  LogoUrl: string;

  SocialLinks: {
    github?: string;
    discord?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };

  Status: "pending" | "under_review" | "approved" | "active";
  Members?: mongoose.Types.ObjectId[]; // Array of Member IDs
  Judges?: mongoose.Types.ObjectId[]; // Array of Judge IDs
};
