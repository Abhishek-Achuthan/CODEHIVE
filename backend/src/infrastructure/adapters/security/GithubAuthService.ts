import axios from 'axios';
import { injectable } from 'tsyringe';
import { env } from '../../../config/envConfig';
import { IGithubAuthService } from '../../../application/ports/security/IGithubAuthService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { UnauthorizedError } from '../../../core/errors/UnauthorizedError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

interface GithubEmailEntry {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

@injectable()
export class GitHubAuthService implements IGithubAuthService {
  private getCredentials(): { clientId: string; clientSecret: string } {
    const clientId = env.githubClientId;
    const clientSecret = env.githubClientSecret;

    if (!clientId || !clientSecret) {
      throw new NotFoundError(ERROR_MESSAGES.GITHUB.MISSING_ENV);
    }

    return { clientId, clientSecret };
  }

  async getUserFromCode(code: string): Promise<{
    email: string;
    name: string;
    githubId: string;
  }> {
    try {
      const accessToken = await this.getTokensFromCode(code);
      const [userInfo, primaryEmail] = await Promise.all([
        this.getUserInfo(accessToken),
        this.getEmail(accessToken),
      ]);

      return {
        email: primaryEmail,
        name: userInfo.name || userInfo.login,
        githubId: userInfo.id.toString(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new UnauthorizedError(ERROR_MESSAGES.GITHUB.INVALID_CREDENTIALS);
      }
      throw error;
    }
  }

  private async getTokensFromCode(code: string): Promise<string> {
    const { clientId, clientSecret } = this.getCredentials();
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      { headers: { Accept: 'application/json' } },
    );

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.GITHUB.ACCESS_TOKEN_FAILED);
    }

    return accessToken;
  }

  private async getUserInfo(accessToken: string): Promise<{
    id: number;
    name: string;
    login: string;
  }> {
    const response = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  }

  private async getEmail(accessToken: string): Promise<string> {
    const response = await axios.get<GithubEmailEntry[]>(
      'https://api.github.com/user/emails',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const email = response.data.find((e) => e.primary)?.email;
    if (!email) {
      throw new NotFoundError(ERROR_MESSAGES.GITHUB.USER_EMAIL_NOT_FOUND);
    }

    return email;
  }
}
