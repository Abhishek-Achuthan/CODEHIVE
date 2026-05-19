import { injectable } from 'tsyringe';
import { PrivateNoteEntity } from '../../../domain/entities/room/PrivateNoteEntity';
import { IPrivateNoteRepository } from '../../../domain/interfaces/IPrivateNoteRepository';
import { PrivateNoteLeanDoc } from '../schemas/room/PrivateNoteSchema';
import PrivateNoteModel from '../models/room/PrivateNoteModel';

@injectable()
export class PrivateNoteRepository implements IPrivateNoteRepository {
  async findByRoomAndUser(
    roomId: string,
    userId: string,
  ): Promise<PrivateNoteEntity | null> {
    const note = await PrivateNoteModel.findOne({
      roomId,
      userId,
    }).lean<PrivateNoteLeanDoc | null>();

    if (!note) {
      return null;
    }

    return this.toEntity(note);
  }

  async upsert(note: PrivateNoteEntity): Promise<PrivateNoteEntity> {
    const updatedNote = await PrivateNoteModel.findOneAndUpdate(
      {
        roomId: note.roomId,
        userId: note.userId,
      },
      {
        $set: {
          content: note.content,
          updatedAt: new Date(),
        },

        $setOnInsert: {
          roomId: note.roomId,
          userId: note.userId,
          createdAt: note.createdAt,
        },
      },
      {
        upsert: true,
        new: true,
      },
    ).lean<PrivateNoteLeanDoc>();

    return this.toEntity(updatedNote);
  }

  private toEntity(note: PrivateNoteLeanDoc): PrivateNoteEntity {
    return {
      id: note._id.toString(),
      roomId: note.roomId.toString(),
      userId: note.userId.toString(),
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

}
