import { logger } from "./loggerConfig";
import { ILoggerService } from "../../../application/ports/Logging/ILoggerService";


export class LoggingServiceImpl implements ILoggerService {
  info(message: string, meta?: Record<string, unknown>): void {
    logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    logger.error(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(message, meta);
  }
}

