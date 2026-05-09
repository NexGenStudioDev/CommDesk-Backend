import zod from "zod";

export const envSchema = zod.object({
  PORT: zod.string().default("3000"),
  RABBITMQ_URL: zod.string(),
  MONGO_URI: zod.string(),
  JWT_SECRET: zod.string(),
  SMTP_USER: zod.string(),
  SMTP_PASS: zod.string(),
  NODE_ENV: zod.enum(["development", "production", "test"]).default("test"),
});

export type EnvConfig = zod.infer<typeof envSchema>;
