import { JwtPayload } from "jsonwebtoken";
export interface IJWTService {
  genarateAccessToken(claims: JwtPayload): string;
  genarateRefreshToken(claims: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload | string
  verifyRefreshToken(token: string): JwtPayload | string;
  decode(token: string): JwtPayload | string | null
}
