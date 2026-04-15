import { envSchema } from "../validator/env.validator";
import { config } from "dotenv";
config();

export const env_Constant = envSchema.parse(process.env);
