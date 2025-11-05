export interface IGoogleAuthService {
  verifyGoogleToken(authCode: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
  }>;
}
