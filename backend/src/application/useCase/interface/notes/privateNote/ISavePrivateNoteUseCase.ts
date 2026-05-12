import { PrivateNoteEntity } from '../../../../../domain/entities/room/PrivateNoteEntity';

export interface ISavePrivateNoteUseCase {
    execute(userId:string,roomId:string,content:Record<string,unknown>):Promise<PrivateNoteEntity>
}