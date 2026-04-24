import express from "express";
const app = express();

import { route } from "./routes/routes";
import rateLimit from "express-rate-limit";
import { env_Constant } from "./constants/env.constant";

app.use(express.json());

const isProduction = env_Constant.NODE_ENV === "production";
const isTest = env_Constant.NODE_ENV === "test";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Limit requests per 15 minutes
  limit: isProduction ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production, 1000 in development
  standardHeaders: "draft-8", // Returns rate limit info in headers
  legacyHeaders: false,
});

app.use(limiter);

app.use(route);

export default app;
