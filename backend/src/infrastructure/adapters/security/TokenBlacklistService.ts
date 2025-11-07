
import { inject, injectable } from 'tsyringe';
import { ITokenBlacklistService } from '../../../application/ports/security/ITokenBlacklistService';
import type { ICacheService } from '../../../application/ports/cache/ICacheService';
import type { IJWTService } from '../../../application/ports/security/IJWTService';
import { JwtPayload } from 'jsonwebtoken';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { convertUnixTimeStampToTime } from '../../../presentation/utils/unixTimeConverter';


@injectable()
export class TokenBlacklistService implements ITokenBlacklistService {

    constructor(
        @inject('ICacheService') private readonly _cacheService : ICacheService,
        @inject('IJWTService') private readonly _jwtService : IJWTService
    ){}
    
    async blacklistToken(token: string): Promise<void> {
        const decoded = this._jwtService.decode(token) as JwtPayload

        if(!decoded?.exp) throw new NotFoundError('Missing token or expiration time');

        const ttl = convertUnixTimeStampToTime(decoded.exp);

        await this._cacheService.setData(`blacklist:${token}`,ttl,'blacklisted');
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const isBlacklisted = await this._cacheService.getData(token);

        if(isBlacklisted === null) return false;

        return true
    }
}