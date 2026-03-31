import winston from 'winston';
const { printf } = winston.format;
import LokiTransport from 'winston-loki';

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat, winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),
    new LokiTransport({
      host: process.env.LOKI_URL || 'http://localhost:3100',
      labels: { app: 'codehive-backend' },
      json: true,
      replaceTimestamp: true,
    }),
  ],
});