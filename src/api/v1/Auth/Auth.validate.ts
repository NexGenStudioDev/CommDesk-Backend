import { z } from "zod";
import { AuthType } from "./Auth.type";
import { ROLE_CONSTANT } from "./Auth.Constant";

export const ValidateAuthData: z.ZodType<AuthType | unknown> = z
  .object({
    email: z.string().email(),
    passwordHash: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    role: z
      .enum(Object.values(ROLE_CONSTANT) as [string, ...string[]])
      .default(ROLE_CONSTANT.PARTICIPANT),
    userId: z.string().optional(),
    emailVerified: z.boolean().optional().default(false),
    failedLoginAttempts: z.number().optional().default(0),
    isBanned: z.boolean().optional().default(false),
  })
  .strict();
