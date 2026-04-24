import { z } from "zod";
import mongoose from "mongoose";

// ObjectId validator
export const objectIdSchema = z
  .string()
  .refine((val) => val === "" || mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .optional();

// Zod schema
export const CreateOrganizerZodSchema = z.object({
  OwnerID: objectIdSchema,

  CommunityName: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(100),

  Bio: z.string().min(10, "Bio must be at least 10 characters").max(1000),

  Slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and URL-friendly"),

  Website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  Country: z.string().min(2),
  City: z.string().min(2),

  OfficialEmail: z.string().email("Invalid email"),

  ContactPhone: z.string().regex(/^[0-9]{7,15}$/, "Invalid phone number"),

  LogoUrl: z.string().url("Invalid logo URL").optional(),

  SocialLinks: z.object({
    github: z.string().url().optional(),
    discord: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }),

  Status: z.enum(["pending", "under_review", "approved", "active"]),

  Members: z.array(objectIdSchema).optional().default([]),
  Judges: z.array(objectIdSchema).optional().default([]),
});

// ✅ Infer TypeScript type from schema
export type CreateOrganizerInput = z.infer<typeof CreateOrganizerZodSchema>;
