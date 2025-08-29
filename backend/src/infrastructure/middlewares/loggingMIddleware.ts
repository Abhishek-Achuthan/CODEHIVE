import expressWinston from "express-winston";
import { logger } from "../adapters/Logging/loggerConfig";

// Request logs
export const requestLoggerMiddleware = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  colorize: process.env.NODE_ENV !== "production", 
  expressFormat: process.env.NODE_ENV !== "production", 
});

// Error logs
export const errorLoggerMiddleware = expressWinston.errorLogger({
  winstonInstance: logger,
});
