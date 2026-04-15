import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
config();
import helmet from "helmet";

import rateLimit from "express-rate-limit";
import SendResponse from "./utils/SendResponse";
import Pino_logger from "./core/logger/pino";
import { env_Constant } from "./constants/env.constant";
import { connectDB } from "./config/db.config";
import { date } from "zod";

const isProduction = env_Constant.NODE_ENV === "production";
const isTest = env_Constant.NODE_ENV === "test";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Limit requests per 15 minutes
  limit: isProduction ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production, 1000 in development
  standardHeaders: "draft-8", // Returns rate limit info in headers
  legacyHeaders: false,
});

// src/utils/SendResponse.ts

const app = express();

app.use(helmet());

app.set("trust proxy", true);

app.use(
  morgan(
    (tokens, req, res) => {
      return JSON.stringify({
        method: tokens.method(req, res),
        date: tokens.date(req, res, "iso"),
        url: tokens.url(req, res),
        status: Number(tokens.status(req, res)),
        responseTime: Number(tokens["response-time"](req, res)),
        contentLength: tokens.res(req, res, "content-length") || 0,
        ip: req.ip,
      });
    },
    {
      skip: () => isTest,
      stream: {
        write: (message: string) => {
          Pino_logger.info(JSON.parse(message));
        },
      },
    },
  ),
);

app.use(express.json());

app.use(limiter);

const PORT = env_Constant.PORT || 3000;

app.get("/", (req: express.Request, res: express.Response) => {
  SendResponse.SuccessResponse(res, null, "Welcome to CommDesk API");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
