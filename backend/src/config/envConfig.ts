import { getEnv } from './infisicalConfig';

function requireEnv(name: string): string {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}



export const env = {
  get mongouri() {
    return getEnv('MONGO_URI');
  },
  get frontendUrl() {
    return getEnv('FRONTEND_URL');
  },
  get backendUrl() {
    return getEnv('BACKEND_URL');
  },
  get port() {
    return getEnv('PORT');
  },
  get hocuspocusPort() {
    return Number(getEnv('HOCUSPOCUS_PORT'));
  },
  get loggerlvl() {
    return getEnv('LOGGER_LEVEL');
  },
  get nodeEnv() {
    return getEnv('NODE_ENV');
  },
  get redisUrl() {
    return getEnv('REDIS_URL');
  },
  get smtpUser() {
    return getEnv('SMTP_USER');
  },
  get smtpPass() {
    return getEnv('SMTP_PASS');
  },
  get hostMail() {
    return getEnv('HOST_MAIL');
  },
  get secretKey() {
    return getEnv('SECRET_KEY');
  },
  get accessTokenSKY() {
    return getEnv('ACCESS_TOKEN_SECRET_KEY');
  },
  get refreshTokenSKY() {
    return getEnv('REFRESH_TOKEN_SECRET_KEY');
  },
  get accessTokenExp() {
    return getEnv('ACCESS_TOKEN_EXPIRY');
  },
  get refreshTokenExp() {
    return getEnv('REFRESH_TOKEN_EXPIRY');
  },
  get clientId() {
    return getEnv('GOOGLE_CLIENT_ID');
  },
  get clientSecret() {
    return getEnv('GOOGLE_CLIENT_SECRET');
  },
  get githubClientId() {
    return getEnv('GITHUB_CLIENT_ID');
  },
  get githubClientSecret() {
    return getEnv('GITHUB_CLIENT_SECRET');
  },
  get aiApiKey() {
    return getEnv('GEMINI_API_KEY');
  },
  get aiModel() {
    return getEnv('GEMINI_MODEL');
  },
  get stripeSKY() {
    return requireEnv('STRIPE_SECRET_KEY');
  },
  get stripeWebhookSKY() {
    return requireEnv('STRIPE_WEBHOOK_SECRET_KEY');
  },
  get cloudAMQPUrl() {
    return getEnv('CLOUDAMQP_URL');
  },
  get roomArchiveGracePeriodMs() {
    return Number(
      getEnv('ROOM_ARCHIVE_GRACE_PERIOD_MS'),
    );
  },
  get judge0Url() {
    return getEnv('JUDGE0_URL');
  },
  get judge0AuthToken() {
    return getEnv('JUDGE0_AUTH_TOKEN');
  },
  get judge0CpuTimeLimit() {
    return Number(getEnv('JUDGE0_CPU_TIME_LIMIT'));
  },
  get judge0MemoryLimit() {
    return Number(getEnv('JUDGE0_MEMORY_LIMIT'));
  },
  get judge0WallTimeLimit() {
    return Number(getEnv('JUDGE0_WALL_TIME_LIMIT'));
  },
  get maxSourceCodeSize() {
    return Number(getEnv('MAX_SOURCE_CODE_SIZE'));
  },
  get jitsiAppId() {
    return requireEnv('JITSI_APP_ID');
  },
  get jitsiApiKey() {
    return requireEnv('JITSI_API_KEY');
  },
  get jitsiPrivateKey() {
    return requireEnv('JITSI_PRIVATE_KEY');
  },
  get lokiUrl() {
    return getEnv('LOKI_URL');
  },
  get infisicalClientId() {
    return process.env.INFISICAL_CLIENT_ID;
  },
  get infisicalClientSecret() {
    return process.env.INFISICAL_CLIENT_SECRET;
  },
  get infisicalProjectId() {
    return process.env.INFISICAL_PROJECT_ID;
  },
  get infisicalSiteUrl() {
    return process.env.INFISICAL_SITE_URL;
  },
  get infisicalEnv() {
    return process.env.INFISICAL_ENV;
  },
};

export function logLoadedEnv(options: { maskSecrets?: boolean } = {}): void {
  const { maskSecrets = false } = options;
  console.log('=== Loaded Environment Variables ===');
  const keys = Object.keys(env) as (keyof typeof env)[];

  for (const key of keys) {
    try {
      const val = env[key];
      const sensitiveKeywords = ['secret', 'key', 'pass', 'token', 'sky'];
      const isSensitive = sensitiveKeywords.some((kw) =>
        key.toLowerCase().includes(kw)
      );

      let displayValue: string;
      if (maskSecrets && isSensitive && typeof val === 'string' && val.length > 0) {
        displayValue = val.length > 8 ? `${val.slice(0, 4)}...${val.slice(-4)}` : '********';
      } else {
        displayValue = String(val);
      }

      console.log(`  ${key}: ${displayValue}`);
    } catch (error) {
      console.log(
        `  ${key}: [ERROR: ${error instanceof Error ? error.message : 'Failed to resolve'}]`
      );
    }
  }
  console.log('====================================');
}
export const consoleLoadedEnv = logLoadedEnv;
