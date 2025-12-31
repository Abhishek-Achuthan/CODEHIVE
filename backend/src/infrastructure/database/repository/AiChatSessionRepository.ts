import { Model, Types } from 'mongoose';
import { IAiChatSessionRepository } from '../../../domain/interfaces/IAiChatSessionRepository';
import { AiChatSessionEntity } from '../../../domain/entities/qna/AiChatSessionEntity';
import AiChatSessionModel from '../models/qna/AiChatSessionModel';
import {
  AiChatSessionDoc,
  AiChatSessionLeanDoc,
} from '../schemas/qna/AiChatSessionSchema';

export class AiChatSessionRepository implements IAiChatSessionRepository {
  private readonly _model: Model<AiChatSessionDoc>;

  constructor() {
    this._model = AiChatSessionModel as Model<AiChatSessionDoc>;
  }

  async findById(sessionId: string): Promise<AiChatSessionEntity | null> {
    const doc = await this._model
      .findById(sessionId)
      .lean<AiChatSessionLeanDoc | null>();

    return doc ? this.leanToEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<AiChatSessionEntity | null> {
    const doc = await this._model
      .findOne({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .lean<AiChatSessionLeanDoc | null>();

    return doc ? this.leanToEntity(doc) : null;
  }

  async listByUserId(userId: string, limit: number): Promise<AiChatSessionEntity[]> {
    const pageLimit = Math.max(1, Math.min(100, limit));

    const docs = await this._model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .limit(pageLimit)
      .lean<AiChatSessionLeanDoc[]>();

    return docs.map((d) => this.leanToEntity(d as AiChatSessionLeanDoc));
  }

  async listOldSessionIdsByUserId(userId: string, keepLimit: number): Promise<string[]> {
    const safeKeep = Math.max(0, Math.min(100, keepLimit));

    const docs = await this._model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .skip(safeKeep)
      .select({ _id: 1 })
      .lean<{ _id: Types.ObjectId }[]>();

    return docs.map((d) => d._id.toString());
  }

  async create(userId: string): Promise<AiChatSessionEntity> {
    const doc = await this._model.create({ userId: new Types.ObjectId(userId) });
    return this.toEntity(doc as AiChatSessionDoc);
  }

  async markActive(sessionId: string): Promise<void> {
    await this._model.findByIdAndUpdate(sessionId, { $set: { updatedAt: new Date() } });
  }

  async deleteByIds(sessionIds: string[]): Promise<void> {
    if (!sessionIds.length) return;

    await this._model.deleteMany({
      _id: { $in: sessionIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this._model.deleteMany({ userId: new Types.ObjectId(userId) });
  }

  private toEntity(doc: AiChatSessionDoc): AiChatSessionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private leanToEntity(doc: AiChatSessionLeanDoc): AiChatSessionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
