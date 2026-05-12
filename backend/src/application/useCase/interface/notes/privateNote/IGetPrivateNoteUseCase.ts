import { PrivateNoteEntity } from '../../../../../domain/entities/room/PrivateNoteEntity';

export interface IGetPrivateNoteUseCase{
    execute(roomId:string,userId:string):Promise<PrivateNoteEntity | null>    
}