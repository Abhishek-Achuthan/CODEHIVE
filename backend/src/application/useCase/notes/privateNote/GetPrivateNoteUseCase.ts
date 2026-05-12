import { injectable,inject } from 'tsyringe';
import { IGetPrivateNoteUseCase } from '../../interface/notes/privateNote/IGetPrivateNoteUseCase';
import { PrivateNoteEntity } from '../../../../domain/entities/room/PrivateNoteEntity';
import type { IPrivateNoteRepository } from '../../../../domain/interfaces/IPrivateNoteRepository';



@injectable()
export class GetPrivateNoteUseCase implements IGetPrivateNoteUseCase {

    constructor(
        @inject('IPrivateNoteRepository') private readonly _noteRepo : IPrivateNoteRepository,
    ) {}

    async execute(roomId: string, userId: string): Promise<PrivateNoteEntity | null> {

        const note = await this._noteRepo.findByRoomAndUser(roomId,userId);
        
        return note
    }
}