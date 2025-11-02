export function convertUnixTimeStampToTime(unixTimeStamp : number): number {

    if(!unixTimeStamp || typeof unixTimeStamp !== 'number') {
        throw new Error('Invalid Unix timestamp');
    }

    const currentTime = Math.floor(Date.now() /1000);

    const ttl = unixTimeStamp - currentTime;

    return ttl > 0 ? ttl : 0;
}