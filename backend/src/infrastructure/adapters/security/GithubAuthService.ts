import axios from "axios";
import { injectable } from "tsyringe";
import { env } from "../../../config/envConfig";
import { IGithubAuthService } from "../../../application/ports/security/IGithubAuthService";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { UnauthorizedError } from "../../../core/errors/UnauthorizedError";

@injectable()
export class GitHubAuthService implements IGithubAuthService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = env.githubClientId!;
    this.clientSecret = env.githubClientSecret!;

    if (!this.clientId || !this.clientSecret) {
      throw new NotFoundError("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in .env");
    }
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
        throw new UnauthorizedError("GitHub authentication failed");
      }
      throw error;
    }
  }

  private async getTokensFromCode(code: string): Promise<string> {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new UnauthorizedError("Failed to retrieve GitHub access token");
    }

    return accessToken;
  }

  private async getUserInfo(accessToken: string): Promise<{
    id: number;
    name: string;
    login: string;
  }> {
    const response = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  }

  private async getEmail(accessToken: string): Promise<string> {
    const response = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = response.data.find((e: any) => e.primary)?.email;
    if (!email) {
      throw new NotFoundError("No email found for GitHub user");
    }

    return email;
  }
}
