import { IJWTservice } from "../../application/services/IJWTservice";
import {sign,verify} from "jsonwebtoken"
import { JWTPayloadType } from "../../domain/types/JWTPayloadType"

const JWTsecret = process.env.JWT_SECRET;
    // const JWTexpires = process.env.JWT_EXPIRES || "15m";


export class JWTServiceImpl implements IJWTservice{
    createAccessToken(payload: JWTPayloadType): string {
        const secretKey = JWTsecret;
        if(!secretKey){
            throw new Error("access token secret not provided in env");
        }
        return sign(payload,secretKey,{expiresIn:"15m"});
    }

    createRefreshToken(payload: JWTPayloadType): string {
        const secretKey = JWTsecret;
        if(!secretKey){
            throw new Error("refresh token secret not provided in env");
        }
    }
}