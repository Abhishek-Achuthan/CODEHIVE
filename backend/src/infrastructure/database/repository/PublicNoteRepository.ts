import mongoose, { Model } from 'mongoose';

import { PublicNoteEntity } from '../../../domain/entities/room/PublicNoteEntity';
import { IPublicNoteRepository } from '../../../domain/interfaces/IPublicNoteRepository';
import PublicNoteModel from '../models/room/PublicNoteModel';
import { GenericRepository } from './GenericRepository';
import {
  PublicNoteDoc,
  PublicNoteLeanDoc,
} from '../schemas/room/PublicNoteSchema';

export class PublicNoteRepository
  extends GenericRepository<PublicNoteDoc, PublicNoteEntity>
  implements IPublicNoteRepository
{
  constructor() {
    super(PublicNoteModel as Model<PublicNoteDoc>);
  }

  async findByRoomId(roomId: string): Promise<PublicNoteEntity | null> {
    const doc = await this._model.findOne({ roomId }).lean<PublicNoteLeanDoc | null>();
    if (!doc) return null;
    return this.leanToEntity(doc);
  }

  async upsert(
    roomId: string,
    content: string,
    updatedBy: string,
  ): Promise<PublicNoteEntity> {
    const doc = await this._model
      .findOneAndUpdate(
        {
          roomId: roomId,
        },
        {
          $set: {
            content,
            updatedBy,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .lean<PublicNoteLeanDoc | null>();
    
    return this.leanToEntity(doc!);
  }

  protected toEntity(doc: PublicNoteDoc): PublicNoteEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId,
      createdAt: doc.createdAt,
      content: doc.content,
      updatedAt: doc.updatedAt,
      updatedBy: doc.updatedBy.toString(),
    };
  }

  protected leanToEntity(doc : PublicNoteLeanDoc) : PublicNoteEntity {
      return {
      id: doc._id.toString(),
      roomId: doc.roomId,
      createdAt: doc.createdAt,
      content: doc.content,
      updatedAt: doc.updatedAt,
      updatedBy: doc.updatedBy.toString(),
    };
  }

  protected toDocument(
    data: Partial<PublicNoteEntity>,
  ): Partial<PublicNoteDoc> {
    return {
      ...(data.roomId !== undefined && { roomId: data.roomId }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.updatedBy !== undefined && {
        updatedBy: new mongoose.Types.ObjectId(data.updatedBy),
      }),
    };
  }
}
