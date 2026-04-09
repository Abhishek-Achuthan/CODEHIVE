import { Model, Types } from 'mongoose';

import { GenericRepository } from './GenericRepository';
import MessageModel from '../models/room/MessageModel';
import {
  MessageDocument,
  MessageLeanDoc,
} from '../schemas/room/MessageSchema';
import { MessageEntity } from '../../../domain/entities/room/MessageEntity';
import { IMessageRepository } from '../../../domain/interfaces/IMessageRepository';

export class MessageRepository
  extends GenericRepository<MessageDocument, MessageEntity>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel as Model<MessageDocument>);
  }

  async findByRoomId(roomId: string): Promise<MessageEntity[]> {
    const docs = await this._model
      .find({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: 1 })
      .lean<MessageLeanDoc[]>();

    return docs.map((doc) => this.leanToEntity(doc));
  }

  async findRecentByRoomId(roomId: string, limit: number): Promise<MessageEntity[]> {
    const docs = await this._model
      .find({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: -1 }) // Sort DESC to get latest
      .limit(limit)
      .lean<MessageLeanDoc[]>();

    // Reverse to return in ASC chronological order
    return docs.reverse().map((doc) => this.leanToEntity(doc));
  }

  protected toEntity(doc: MessageDocument): MessageEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      senderId: doc.senderId.toString(),
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  protected toDocument(data: Partial<MessageEntity>): Partial<MessageDocument> {
    const doc: Partial<MessageDocument> = {};

    if (data.roomId !== undefined) doc.roomId = new Types.ObjectId(data.roomId);
    if (data.senderId !== undefined) {
      doc.senderId = new Types.ObjectId(data.senderId);
    }
    if (data.content !== undefined) doc.content = data.content;
    return doc;
  }

  leanToEntity(doc: MessageLeanDoc): MessageEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      senderId: doc.senderId.toString(),
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

