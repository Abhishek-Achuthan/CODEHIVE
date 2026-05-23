import { Model, Types } from 'mongoose';
import { GenericRepository } from './GenericRepository';
import SubscriptionModel from '../models/SubscriptionModel';
import { ISubscriptionRepository } from '../../../domain/interfaces/ISubscriptionRepository';
import { SubscriptionEntity } from '../../../domain/entities/SubscriptionEntity';
import { SubscriptionDocument, SubscriptionLeanDoc } from '../schemas/SubscriptionSchema';
import { SubscriptionStatus } from '../../../domain/types/SubscriptionStatus';

export class SubscriptionRepository
  extends GenericRepository<SubscriptionDocument, SubscriptionEntity>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel as Model<SubscriptionDocument>);
  }

  async findActiveByUserId(userId: string): Promise<SubscriptionEntity | null> {
    const doc = await this._model
      .findOne({
        userId: new Types.ObjectId(userId),
        status: {
          $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      })
      .lean<SubscriptionLeanDoc | null>();

    if (!doc) return null;

    return this.leanToEntity(doc);
  }

  protected toEntity(doc: SubscriptionDocument): SubscriptionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      planId: doc.planId.toString(),
      status: doc.status,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      cancelAtPeriodEnd: doc.cancelAtPeriodEnd,
      ...(doc.stripeCustomerId !== undefined && { stripeCustomerId: doc.stripeCustomerId }),
      ...(doc.stripeSubscriptionId !== undefined && { stripeSubscriptionId: doc.stripeSubscriptionId }),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  protected toDocument(data: Partial<SubscriptionEntity>): Partial<SubscriptionDocument> {
    const doc: Partial<SubscriptionDocument> = {};

    if (data.userId !== undefined) {
      doc.userId = new Types.ObjectId(data.userId) as any;
    }
    if (data.planId !== undefined) {
      doc.planId = new Types.ObjectId(data.planId) as any;
    }
    if (data.status !== undefined) {
      doc.status = data.status;
    }
    if (data.currentPeriodStart !== undefined) {
      doc.currentPeriodStart = data.currentPeriodStart;
    }
    if (data.currentPeriodEnd !== undefined) {
      doc.currentPeriodEnd = data.currentPeriodEnd;
    }
    if (data.cancelAtPeriodEnd !== undefined) {
      doc.cancelAtPeriodEnd = data.cancelAtPeriodEnd;
    }
    if (data.stripeCustomerId !== undefined) {
      doc.stripeCustomerId = data.stripeCustomerId;
    }
    if (data.stripeSubscriptionId !== undefined) {
      doc.stripeSubscriptionId = data.stripeSubscriptionId;
    }

    return doc;
  }

  protected leanToEntity(doc: SubscriptionLeanDoc): SubscriptionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      planId: doc.planId.toString(),
      status: doc.status,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      cancelAtPeriodEnd: doc.cancelAtPeriodEnd,
      ...(doc.stripeCustomerId !== undefined && { stripeCustomerId: doc.stripeCustomerId }),
      ...(doc.stripeSubscriptionId !== undefined && { stripeSubscriptionId: doc.stripeSubscriptionId }),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
