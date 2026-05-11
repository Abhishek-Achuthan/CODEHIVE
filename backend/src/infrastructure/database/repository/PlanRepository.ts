import { Model } from 'mongoose';
import { GenericRepository } from './GenericRepository';
import PlanModel from '../models/PlanModel';
import { PlanDocument, PlanLeanDoc } from '../schemas/PlanSchema';
import { PlanEntity } from '../../../domain/entities/PlanEntity';
import { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { FeatureKey } from '../../../domain/types/FeatureKey';
import { LimitKey } from '../../../domain/types/LimitKey';

export class PlanRepository
  extends GenericRepository<PlanDocument, PlanEntity>
  implements IPlanRepository
{
  constructor() {
    super(PlanModel as Model<PlanDocument>);
  }

  async findAllActive(): Promise<PlanEntity[]> {
    const docs = await this._model.find({ isActive: true }).lean<PlanLeanDoc[]>();
    return docs.map((doc) => this.leanToEntity(doc));
  }

  async findByName(name: string): Promise<PlanEntity | null> {
    const doc = await this._model.findOne({ name }).lean<PlanLeanDoc | null>();
    return doc ? this.leanToEntity(doc) : null;
  }

  protected toEntity(doc: PlanDocument): PlanEntity {
    return this.leanToEntity({
      _id: doc._id,
      name: doc.name,
      ...(doc.description !== undefined ? { description: doc.description } : {}),
      price: doc.price,
      currency: doc.currency,
      isActive: doc.isActive,
      features: doc.features,
      limits: Object.fromEntries(doc.limits) as Record<LimitKey, number>,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  protected toDocument(data: Partial<PlanEntity>): Partial<PlanDocument> {
    const doc: Partial<PlanDocument> = {};

    if (data.name !== undefined) doc.name = data.name;
    if (data.description !== undefined) doc.description = data.description;
    if (data.price !== undefined) doc.price = data.price;
    if (data.currency !== undefined) doc.currency = data.currency;
    if (data.isActive !== undefined) doc.isActive = data.isActive;
    if (data.features !== undefined) doc.features = data.features;
    if (data.limits !== undefined) doc.limits = new Map(Object.entries(data.limits)) as Map<LimitKey, number>;

    return doc;
  }

  leanToEntity(doc: PlanLeanDoc): PlanEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      ...(doc.description !== undefined ? { description: doc.description } : {}),
      price: doc.price,
      currency: doc.currency,
      isActive: doc.isActive,
      features: (doc.features ?? []) as FeatureKey[],
      limits: (doc.limits ?? {}) as Partial<Record<LimitKey, number>>,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
