import z from "zod";

// Community Name: Apex Circle
// Bio: Developer community focused on open source and hackathons
// Website: https://apexcircle.dev
// Country: India
// City: Ranchi

// officialEmail: team@apexcircle.dev
// contactPhone: +91XXXXXXXXXX

// github
// discord
// twitter
// linkedin
// youtube
// instagram

export const CreateOrganizerZodSchema: z.ZodType<any> = z.object({
  OwnerID: z.string().optional(),
});
