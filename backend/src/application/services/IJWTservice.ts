import { JWTPayloadType } from "../../domain/types/JWTPayloadType";

export interface IJWTservice {
  createAccessToken(payload : JWTPayloadType) : string;
  createRefreshToken(payload : JWTPayloadType) : string;
  verifyAccessToken(token : string) : JWTPayloadType | null;
  verifyRefreshToken(token : string) : JWTPayloadType | null;
}
