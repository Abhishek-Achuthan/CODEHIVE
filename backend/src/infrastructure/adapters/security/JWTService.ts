import { IJWTService } from "../../../application/ports/security/IJWTService";
import { env } from "../../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export class JWTService implements IJWTService {
  genarateAccessToken(claims: JwtPayload): string {
    return jwt.sign(claims, env.accessTokenSKY, { expiresIn: "1h" });
  }

  genarateRefreshToken(claims: JwtPayload): string {
    return jwt.sign(claims, env.refreshTokenSKY, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): JwtPayload | string {
      return jwt.verify(token, env.accessTokenSKY);
  }

  verifyRefreshToken(token: string): JwtPayload | string {
    return jwt.verify(token, env.refreshTokenSKY);
  }

  decode(token: string): JwtPayload | string | null {
    return jwt.decode(token);
  }
}
