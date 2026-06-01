import zod from "zod";

// CLOUDINARY_CLOUD_NAME=your_cloud_name
// CLOUDINARY_API_KEY=your_api_key
// CLOUDINARY_API_SECRET=your_api_secret

export const envSchema = zod.object({
  FRONTEND_URL: zod.string(),
  PORT: zod.string().default("3000"),
  RABBITMQ_URL: zod.string(),
  MONGO_URI: zod.string(),
  SarvamAi_ApiKey: zod.string(),
  CLOUDINARY_CLOUD_NAME: zod.string(),
  CLOUDINARY_API_KEY: zod.string(),
  CLOUDINARY_API_SECRET: zod.string(),
  JWT_ACCESS_SECRET: zod.string(),
  JWT_REFRESH_SECRET: zod.string(),
  CashFresh_API_KEY: zod.string(),
  CashFresh_API_SECRET: zod.string(),
  CashFree_Url: zod.string(),
  SMTP_USER: zod.string(),
  SMTP_PASS: zod.string(),
  NODE_ENV: zod.enum(["development", "production", "test"]).default("test"),
});

export type EnvConfig = zod.infer<typeof envSchema>;
