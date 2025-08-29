import winston from "winston";
import LokiTransport from "winston-loki";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "C:/Users/hp/Desktop/CODEHIVE/backend/logs/app.log" }), 
    new LokiTransport({
      host: process.env.LOKI_URL || "http://localhost:3100",
      labels: { app: "codehive-backend" },
      json: true,
      replaceTimestamp: true,
    }),
  ],
});

