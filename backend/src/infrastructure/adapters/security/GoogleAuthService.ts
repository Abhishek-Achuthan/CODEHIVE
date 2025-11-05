import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService } from "../../../application/ports/security/IGoogleAuthService";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { injectable } from "tsyringe";
import { env } from "../../../config/envConfig";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
  this.clientId = env.clientId!;
  this.clientSecret = env.clientSecret!;
  this.redirectUri =  "postmessage";

  if (!this.clientId || !this.clientSecret) {
    throw new NotFoundError("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env");
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

    if (!idToken) throw new NotFoundError("Failed to retrieve Google ID token");

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new NotFoundError("Invalid Google Token");

    const [firstName, ...rest] = (payload.name ?? "").split(" ");
    return {
      email: payload.email ?? "",
      firstName: firstName || "",
      lastName: rest.join(" ") || "",
      googleId: payload.sub ?? "",
    };
  }
}
