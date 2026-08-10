import { OAuth2Client } from 'google-auth-library';
import { IGoogleAuthService } from '../../../application/ports/security/IGoogleAuthService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { injectable } from 'tsyringe';
import { env } from '../../../config/envConfig';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private _client: OAuth2Client | null = null;

  private getClient(): { client: OAuth2Client; clientId: string } {
    const clientId = env.clientId;
    const clientSecret = env.clientSecret;

    if (!clientId || !clientSecret) {
      throw new NotFoundError(ERROR_MESSAGES.GOOGLE.MISSING_ENV);
    }

    if (!this._client) {
      this._client = new OAuth2Client(clientId, clientSecret, 'postmessage');
    }

    return { client: this._client, clientId };
  }

  async verifyGoogleToken(authCode: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
  }> {
    const { client, clientId } = this.getClient();
    const { tokens } = await client.getToken(authCode);
    const idToken = tokens.id_token;

    if (!idToken) throw new NotFoundError(ERROR_MESSAGES.GOOGLE.INVALID_TOKEN);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload)
      throw new NotFoundError(ERROR_MESSAGES.GOOGLE.INVALID_PAYLOAD);

    const [firstName, ...rest] = (payload.name ?? '').split(' ');
    return {
      email: payload.email ?? '',
      firstName: firstName || '',
      lastName: rest.join(' ') || '',
      googleId: payload.sub ?? '',
    };
  }
}
