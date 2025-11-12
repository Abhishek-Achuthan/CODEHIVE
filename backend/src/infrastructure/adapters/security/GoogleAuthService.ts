import { OAuth2Client } from 'google-auth-library';
import { IGoogleAuthService } from '../../../application/ports/security/IGoogleAuthService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { injectable } from 'tsyringe';
import { env } from '../../../config/envConfig';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
  this.clientId = env.clientId!;
  this.clientSecret = env.clientSecret!;
  this.redirectUri =  'postmessage';

  if (!this.clientId || !this.clientSecret) {
    throw new NotFoundError(ERROR_MESSAGES.GOOGLE.MISSING_ENV);
  }

  this.client = new OAuth2Client(this.clientId, this.clientSecret, this.redirectUri);
}


  async verifyGoogleToken(authCode: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
  }> {
    const { tokens } = await this.client.getToken(authCode);
    const idToken = tokens.id_token;

    if (!idToken) throw new NotFoundError(ERROR_MESSAGES.GOOGLE.INVALID_TOKEN);

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new NotFoundError(ERROR_MESSAGES.GOOGLE.INVALID_PAYLOAD);

    const [firstName, ...rest] = (payload.name ?? '').split(' ');
    return {
      email: payload.email ?? '',
      firstName: firstName || '',
      lastName: rest.join(' ') || '',
      googleId: payload.sub ?? '',
    };
  }
}
