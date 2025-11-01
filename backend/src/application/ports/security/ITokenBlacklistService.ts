export interface ITokenBlacklistService {
  blacklistToken(token: string): Promise<void>;
  isTokenBlacklisted(token:string):Promise<boolean>;
}

