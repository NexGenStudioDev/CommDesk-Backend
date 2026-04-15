import zod from "zod";

export const envSchema = zod.object({
  PORT: zod.string().default("3000"),
  MONGO_URI: zod.string(),
  JWT_SECRET: zod.string(),
  NODE_ENV: zod.enum(["development", "production", "test"]).default("test"),
});

export type EnvConfig = zod.infer<typeof envSchema>;
