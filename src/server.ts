import express from "express";
import { config } from "dotenv";
config();
import helmet from "helmet";

import rateLimit from "express-rate-limit";
import SendResponse from "./utils/SendResponse";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: "draft-8", // Returns rate limit info in headers
  legacyHeaders: false,
});

// src/utils/SendResponse.ts

const app = express();

app.use(helmet());

app.use(express.json());

app.use(limiter);

const PORT = process.env.PORT || 3000;

app.get("/", (req: express.Request, res: express.Response) => {
  SendResponse.SuccessResponse(res, null, "Welcome to CommDesk API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
