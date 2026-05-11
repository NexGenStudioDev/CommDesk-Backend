import express from "express";
import morgan from "morgan";

import helmet from "helmet";

import rateLimit from "express-rate-limit";
import SendResponse from "./utils/SendResponse";
import Pino_logger from "./core/logger/pino";
import { env_Constant } from "./constants/env.constant";

import { connectDB } from "./core/database/db.config";
import DeviceSessionUtils from "./api/v1/DeviceSession/DeviceSession.Utils";
import app from "./app";

import { initializeGlobalChannel } from "./infrastructure/queue/channel";
import Consumers from "./infrastructure/queue/queue.consumers";

const isProduction = env_Constant.NODE_ENV === "production";
const isTest = env_Constant.NODE_ENV === "test";

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  morgan(
    (tokens, req, res) => {
      return JSON.stringify({
        url: tokens.url(req, res),
        method: tokens.method(req, res),
        ip: req.ip,
        date: tokens.date(req, res, "iso"),
        responseTime: Number(tokens["response-time"](req, res)),
        contentLength: tokens.res(req, res, "content-length") || 0,
        status: Number(tokens.status(req, res)),
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

const PORT = env_Constant.PORT || 3000;

app.get("/", async (req: express.Request, res: express.Response) => {
  const deviceInfo = await DeviceSessionUtils.getDeviceInfo(
    req.ip,
    req.headers["user-agent"] || "unknown",
    "guest",
  );
  console.log("Device Info:", deviceInfo);
  SendResponse.SuccessResponse(res, deviceInfo, "Welcome to CommDesk API");
});

const startServer = async () => {
  try {
    await connectDB();
    await initializeGlobalChannel();
    await Consumers();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
