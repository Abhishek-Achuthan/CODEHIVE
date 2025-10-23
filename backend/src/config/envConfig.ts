export const env = {
  mongouri: process.env.MONGO_URI,
  frontendUrl: process.env.FRONTEND_URL,
  port: process.env.PORT,
  loggerlvl: process.env.LOGGER_LEVEL,
  nodeEnv: process.env.NODE_ENV,
  redisUrl: process.env.REDIS_URL,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  hostMail: process.env.HOST_MAIL,
  secretKey: process.env.SECRET_KEY,
  accessTokenSKY: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSKY: process.env.REFRESH_TOKEN_SECRET_KEY,
};
