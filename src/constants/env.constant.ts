import { config } from "dotenv";
config();

import { envSchema } from "../validator/env.validator";

export const env_Constant = envSchema.parse(process.env);
