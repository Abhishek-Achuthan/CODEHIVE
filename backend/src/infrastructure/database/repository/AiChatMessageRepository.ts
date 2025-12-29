import { Types } from 'mongoose';
import { IAiChatMessageRepository } from '../../../domain/interfaces/IAiChatMessageRepository';
import { AiChatMessageEntity } from '../../../domain/entities/qna/AiChatMessageEntity';
import AiChatMessageModel from '../models/qna/AiChatMessageModel';
import {
  AiChatMessageDoc,
  AiChatMessageLeanDoc,
} from '../schemas/qna/AiChatMessageSchema';

export class AiChatMessageRepository implements IAiChatMessageRepository {
  async save(data: {
    sessionId: string;
    role: AiChatMessageEntity['role'];
    content: string;
  }): Promise<AiChatMessageEntity> {
    const created = await AiChatMessageModel.create({
      sessionId: new Types.ObjectId(data.sessionId),
      role: data.role,
      content: data.content,
    });

    return this.toEntity(created as AiChatMessageDoc);
  }

  async getRecentBySession(
    sessionId: string,
    limit: number
  ): Promise<AiChatMessageEntity[]> {
    const pageLimit = Math.max(1, Math.min(100, limit));

    const docs = await AiChatMessageModel.find({
      sessionId: new Types.ObjectId(sessionId),
    })
      .sort({ createdAt: -1 })
      .limit(pageLimit)
      .lean<AiChatMessageLeanDoc[]>();

    return docs.map((d) => this.leanToEntity(d as AiChatMessageLeanDoc));
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    await AiChatMessageModel.deleteMany({
      sessionId: new Types.ObjectId(sessionId),
    });
  }

  async deleteBySessionIds(sessionIds: string[]): Promise<void> {
    if (!sessionIds.length) return;

    await AiChatMessageModel.deleteMany({
      sessionId: { $in: sessionIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  private toEntity(doc: AiChatMessageDoc): AiChatMessageEntity {
    return {
      id: doc._id.toString(),
      sessionId: doc.sessionId.toString(),
      role: doc.role,
      content: doc.content,
      createdAt: doc.createdAt,
    };
  }

  private leanToEntity(doc: AiChatMessageLeanDoc): AiChatMessageEntity {
    return {
      id: doc._id.toString(),
      sessionId: doc.sessionId.toString(),
      role: doc.role,
      content: doc.content,
      createdAt: doc.createdAt,
    };
  }
}
