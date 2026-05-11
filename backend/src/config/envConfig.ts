function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  mongouri: process.env.MONGO_URI || '',
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,
  port: process.env.PORT,
  hocuspocusPort: Number(process.env.HOCUSPOCUS_PORT || 1234),
  loggerlvl: process.env.LOGGER_LEVEL,
  nodeEnv: process.env.NODE_ENV,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  hostMail: process.env.HOST_MAIL,
  secretKey: process.env.SECRET_KEY,
  accessTokenSKY: process.env.ACCESS_TOKEN_SECRET_KEY || 'secretKey',
  refreshTokenSKY: process.env.REFRESH_TOKEN_SECRET_KEY || 'refreshKey',
  accessTokenExp: process.env.ACCESS_TOKEN_EXPIRY || '1h',
  refreshTokenExp: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  aiApiKey: process.env.GEMINI_API_KEY,
  aiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  stripeSKY: requireEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSKY: requireEnv('STRIPE_WEBHOOK_SECRET_KEY'),
};
