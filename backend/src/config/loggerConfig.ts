import winston from 'winston';
import LokiTransport from 'winston-loki';

const WINSTON_INTERNAL_KEYS = new Set([
  'level',
  'message',
  'timestamp',
  'stack',
  'splat',
  'label',
]);

function serializeMetaValue(value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}

const logFormat = winston.format.printf((info) => {
  const { timestamp, level, message, stack, ...rest } = info;

  const meta: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!WINSTON_INTERNAL_KEYS.has(key)) {
      meta[key] = serializeMetaValue(value);
    }
  }

  const splat = info[Symbol.for('splat')];
  if (Array.isArray(splat)) {
    for (const item of splat) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
          meta[key] = serializeMetaValue(value);
        }
      }
    }
  }

  const mainLine = stack || message;
  if (stack) {
    delete meta.stack;
  }
  const metaSuffix =
    Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

  return `${timestamp} [${level}] : ${mainLine}${metaSuffix}`;
});

const baseFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  logFormat
);

export const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || 'info',
  format: baseFormat,
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: process.env.LOKI_URL || 'http://localhost:3100',
      labels: { app: 'codehive-backend' },
      json: true,
      replaceTimestamp: true,
    }),
  ],
});