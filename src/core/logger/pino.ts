import pino from "pino";

const Pino_logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
    levels: {
      fatal: 60,
      error: 50,
      warn: 40,
      info: 30,
      debug: 20,
      trace: 10,
    },
    targets: [
      {
        level: "info",
        target: "pino/file",
        options: { destination: "logs/info.log" },
      },
      {
        level: "error",
        target: "pino/file",
        options: { destination: "logs/error.log" },
      },
    ],
  },
});

export default Pino_logger;
