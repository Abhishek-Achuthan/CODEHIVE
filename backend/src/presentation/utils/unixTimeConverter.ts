import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export function convertUnixTimeStampToTime(unixTimeStamp : number): number {

    if(!unixTimeStamp || typeof unixTimeStamp !== 'number') {
        throw new Error(ERROR_MESSAGES.UTILITY.INVALID_UNIX_TIMESTAMP);
    }

    const currentTime = Math.floor(Date.now() /1000);

    const ttl = unixTimeStamp - currentTime;

    return ttl > 0 ? ttl : 0;
}
