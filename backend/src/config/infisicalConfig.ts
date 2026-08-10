import dotenv from 'dotenv';
import { InfisicalSDK } from '@infisical/sdk';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

let environment = 'dev';
if (nodeEnv === 'production') environment = 'prod';
if (nodeEnv === 'staging') environment = 'staging';

export const secretsStore: Record<string, string | undefined> = {};

export async function initInfisical(): Promise<void> {
  if (
    !process.env.INFISICAL_CLIENT_ID ||
    !process.env.INFISICAL_CLIENT_SECRET
  ) {
    console.log(
      'ℹ️ Infisical keys not found in environment. Using standard process.env.',
    );
    return;
  }

  try {
    const client = new InfisicalSDK();

    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET,
    });

    const { secrets } = await client.secrets().listSecrets({
      environment,
      projectId: process.env.INFISICAL_PROJECT_ID || '',
      secretPath: '/',
    });

    secrets.forEach((secret) => {
      secretsStore[secret.secretKey] = secret.secretValue;
      process.env[secret.secretKey] = secret.secretValue;
    });

    console.log(
      `🪼 Infisical secrets loaded successfully for: [${environment}]`,
    );
  } catch (error) {
    console.error(
      '❌ Failed to authenticate or pull secrets from Infisical:',
      error,
    );
    process.exit(1);
  }
}

export const getEnv = (key: string): string => {
  return secretsStore[key] || process.env[key] || '';
};
