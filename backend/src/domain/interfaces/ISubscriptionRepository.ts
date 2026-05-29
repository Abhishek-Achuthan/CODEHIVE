import { ClientSession } from 'mongoose';
import { SubscriptionEntity } from '../entities/SubscriptionEntity';
import { IGenericRepository } from './IGenericRepository';

export interface ISubscriptionRepository extends IGenericRepository<SubscriptionEntity> {
  findActiveByUserId(userId: string): Promise<SubscriptionEntity | null>;
  findActiveByUserIdWithSession(
    userId: string,
    session: ClientSession,
  ): Promise<SubscriptionEntity | null>;
  findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<SubscriptionEntity | null>;
  findByBillingSubscriptionId(providerSubscriptionId: string): Promise<SubscriptionEntity | null>;

  findByStripeSubscriptionIdWithSession(
    stripeSubscriptionId: string,
    session: ClientSession,
  ): Promise<SubscriptionEntity | null>;
  createWithSession(
    data: Partial<SubscriptionEntity>,
    session: ClientSession,
  ): Promise<SubscriptionEntity>;
  updateWithSession(
    id: string,
    data: Partial<SubscriptionEntity>,
    session: ClientSession,
  ): Promise<SubscriptionEntity | null>;
}