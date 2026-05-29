import { ClientSession, Model, Types } from 'mongoose';
import { GenericRepository } from './GenericRepository';
import SubscriptionModel from '../models/SubscriptionModel';
import { ISubscriptionRepository } from '../../../domain/interfaces/ISubscriptionRepository';
import { SubscriptionEntity } from '../../../domain/entities/SubscriptionEntity';
import { SubscriptionDocument, SubscriptionLeanDoc } from '../schemas/SubscriptionSchema';
import { SubscriptionStatus } from '../../../domain/types/SubscriptionStatus';
import { PlanBillingInterval } from '../../../domain/types/PlanBillingInterval';

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

  async findActiveByUserIdWithSession(
    userId: string,
    session: ClientSession,
  ): Promise<SubscriptionEntity | null> {
    const doc = await this._model
      .findOne({
        userId: new Types.ObjectId(userId),
        status: {
          $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      })
      .session(session)
      .lean<SubscriptionLeanDoc | null>();

    if (!doc) return null;

    return this.leanToEntity(doc);
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<SubscriptionEntity | null> {
    const doc = await this._model
      .findOne({ stripeSubscriptionId })
      .lean<SubscriptionLeanDoc | null>();

    if (!doc) return null;

    return this.leanToEntity(doc);
  }

  async findByBillingSubscriptionId(
    billingSubscriptionId: string,
  ): Promise<SubscriptionEntity | null> {
    return this.findByStripeSubscriptionId(billingSubscriptionId);
  }

  async findByStripeSubscriptionIdWithSession(
    stripeSubscriptionId: string,
    session: ClientSession,
  ): Promise<SubscriptionEntity | null> {
    const doc = await this._model
      .findOne({ stripeSubscriptionId })
      .session(session)
      .lean<SubscriptionLeanDoc | null>();

    if (!doc) return null;

    return this.leanToEntity(doc);
  }

  async createWithSession(
    data: Partial<SubscriptionEntity>,
    session: ClientSession,
  ): Promise<SubscriptionEntity> {
    const docData = this.toDocument(data);
    const [doc] = await this._model.create([docData], { session });
    return this.toEntity(doc as SubscriptionDocument);
  }

  async updateWithSession(
    id: string,
    data: Partial<SubscriptionEntity>,
    session: ClientSession,
  ): Promise<SubscriptionEntity | null> {
    const docData = this.toDocument(data);
    const updated = await this._model.findByIdAndUpdate(id, docData, {
      new: true,
      session,
    });
    return updated ? this.toEntity(updated as SubscriptionDocument) : null;
  }

  protected toEntity(doc: SubscriptionDocument): SubscriptionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      planId: doc.planId.toString(),
      billingInterval: this._mapBillingInterval(doc.billingInterval),
      status: doc.status,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      cancelAtPeriodEnd: doc.cancelAtPeriodEnd,
      ...(doc.stripeCustomerId ? { stripeCustomerId: doc.stripeCustomerId } : {}),
      ...(doc.stripeSubscriptionId ? { stripeSubscriptionId: doc.stripeSubscriptionId } : {}),
      ...(doc.canceledAt ? { canceledAt: doc.canceledAt } : {}),
      ...(doc.expiredAt ? { expiredAt: doc.expiredAt } : {}),
      ...(doc.stripePriceId ? { stripePriceId: doc.stripePriceId } : {}),
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
    if (data.canceledAt !== undefined) {
      doc.canceledAt = data.canceledAt;
    }
    if (data.expiredAt !== undefined) {
      doc.expiredAt = data.expiredAt;
    }
    if (data.stripePriceId !== undefined) {
      doc.stripePriceId = data.stripePriceId;
    }
    if (data.billingInterval !== undefined) {
      doc.billingInterval = data.billingInterval;
    }

    return doc;
  }

  private _mapBillingInterval(value: string | undefined): PlanBillingInterval {
    return value === 'yearly' ? 'yearly' : 'monthly';
  }

  protected leanToEntity(doc: SubscriptionLeanDoc): SubscriptionEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      planId: doc.planId.toString(),
      billingInterval: this._mapBillingInterval(doc.billingInterval),
      status: doc.status,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      cancelAtPeriodEnd: doc.cancelAtPeriodEnd,
      ...(doc.stripeCustomerId ? { stripeCustomerId: doc.stripeCustomerId } : {}),
      ...(doc.stripeSubscriptionId ? { stripeSubscriptionId: doc.stripeSubscriptionId } : {}),
      ...(doc.canceledAt ? { canceledAt: doc.canceledAt } : {}),
      ...(doc.expiredAt ? { expiredAt: doc.expiredAt } : {}),
      ...(doc.stripePriceId ? { stripePriceId: doc.stripePriceId } : {}),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
