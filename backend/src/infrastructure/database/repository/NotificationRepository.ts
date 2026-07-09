import { INotificationRepository } from '../../../domain/interfaces/INotificationRepository';
import { GenericRepository } from './GenericRepository';
import { NotificationEntity } from '../../../domain/entities/NotificationEntity';
import NotificationModel from '../models/NotificationModel';
import { NotificationDocument, NotificationLeanDoc } from '../schemas/NotificationSchema';
import { Model, Types, FilterQuery } from 'mongoose';
import { PaginationResult } from '../../../domain/types/PaginationResult';

export class NotificationRepository
  extends GenericRepository<NotificationDocument, NotificationEntity>
  implements INotificationRepository {
  
  constructor() {
    super(NotificationModel as Model<NotificationDocument>);
  }

  async findByUserId(userId: string, currentPage: number = 1, pageSize: number = 20): Promise<PaginationResult<NotificationEntity>> {
    currentPage = Math.max(1, currentPage ?? 1);
    pageSize = Math.max(1, pageSize ?? 20);

    const query: FilterQuery<NotificationDocument> = { recipientId: new Types.ObjectId(userId) };

    const totalItems = await this._model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (currentPage - 1) * pageSize;

    const docs = await this._model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean<NotificationLeanDoc[]>();

    const items = docs.map((doc) => this.leanToEntity(doc));

    return { items, totalItems, totalPages };
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const result = await this._model.updateOne(
      { _id: new Types.ObjectId(id), recipientId: new Types.ObjectId(userId) },
      { $set: { isRead: true } }
    );
    return result.modifiedCount > 0;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await this._model.updateMany(
      { recipientId: new Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true } }
    );
    return result.modifiedCount > 0;
  }

  protected toDocument(data: Partial<NotificationEntity>): Partial<NotificationDocument> {
    const doc: Partial<NotificationDocument> = {};
    if (data.recipientId) doc.recipientId = new Types.ObjectId(data.recipientId);
    if (data.type) doc.type = data.type;
    if (data.category) doc.category = data.category;
    if (data.title) doc.title = data.title;
    if (data.message) doc.message = data.message;
    if (data.actionUrl !== undefined) doc.actionUrl = data.actionUrl;
    if (data.metadata !== undefined) doc.metadata = data.metadata;
    if (data.isRead !== undefined) doc.isRead = data.isRead;
    return doc;
  }

  protected toEntity(doc: NotificationDocument): NotificationEntity {
    const entity: NotificationEntity = {
      id: doc._id.toString(),
      recipientId: doc.recipientId.toString(),
      type: doc.type,
      category: doc.category,
      title: doc.title,
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    };
    if (doc.actionUrl !== undefined) entity.actionUrl = doc.actionUrl;
    if (doc.metadata !== undefined) entity.metadata = doc.metadata;
    return entity;
  }

  private leanToEntity(doc: NotificationLeanDoc): NotificationEntity {
    const entity: NotificationEntity = {
      id: doc._id.toString(),
      recipientId: doc.recipientId.toString(),
      type: doc.type,
      category: doc.category,
      title: doc.title,
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    };
    if (doc.actionUrl !== undefined) entity.actionUrl = doc.actionUrl;
    if (doc.metadata !== undefined) entity.metadata = doc.metadata;
    return entity;
  }
}
