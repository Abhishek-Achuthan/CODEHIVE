import { injectable } from 'tsyringe';
import { IRoomCodeService } from '../../../application/ports/room/IRoomCodeService';


@injectable()
export class RoomCodeService implements IRoomCodeService {
  genarateRoomCode(): string {
      return Math.random().toString(36).substring(2,8).toUpperCase();
  } 
}