import { FilterQuery, Model } from 'mongoose';
import { GenericRepository } from './GenericRepository';
import PlanModel from '../models/PlanModel';
import { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { PlanEntity } from '../../../domain/entities/PlanEntity';
import { PlanDocument,PlanLeanDoc } from '../schemas/PlanSchema';
import { LimitKey } from '../../../domain/types/LimitKey';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { PaginationParams } from '../../../domain/types/PaginationParams';
import { PlanListQuery } from '../../../domain/types/PlanListQuery';

export class PlanRepository
  extends GenericRepository<PlanDocument, PlanEntity>
  implements IPlanRepository
{
  constructor() {
    super(PlanModel as Model<PlanDocument>);
  }

  async findBySlug(slug: string): Promise<PlanEntity | null> {
    const doc = await this._model
      .findOne({ slug })
      .lean<PlanLeanDoc | null>();

    if (!doc) return null;

    return this.leanToEntity(doc);
  }

  async findAllActive(
    params: PaginationParams,
  ): Promise<PaginationResult<PlanEntity>> {
    const { page, limit, search } = params;
    const query: FilterQuery<PlanDocument> = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }


    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .sort({ sortOrder: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<PlanLeanDoc[]>(),
      this._model.countDocuments(query),
    ]);

    const items = docs.map((doc) => this.leanToEntity(doc));
    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages };
  }

  async findAllPlans(
    queryObj: PlanListQuery,
  ): Promise<PaginationResult<PlanEntity>> {
    const { page, limit, search, isActive, isPublic } = queryObj;
    const query: FilterQuery<PlanDocument> = {};

    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    if (isPublic !== undefined) {
      query.isPublic = isPublic;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const [docs, totalItems] = await Promise.all([
      this._model
        .find(query)
        .sort({ sortOrder: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<PlanLeanDoc[]>(),
      this._model.countDocuments(query),
    ]);

    const items = docs.map((doc) => this.leanToEntity(doc));
    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages };
  }

  protected toEntity(doc: PlanDocument): PlanEntity {
    return {
      id: doc._id.toString(),

      name: doc.name,

      slug: doc.slug,

      ...(doc.description !== undefined
        ? { description: doc.description }
        : {}),

      isActive: doc.isActive,

      isPublic: doc.isPublic,

      sortOrder: doc.sortOrder,

      features: doc.features,

      limits: doc.limits
        ? (doc.limits instanceof Map
            ? (Object.fromEntries(doc.limits) as Partial<
                Record<LimitKey, number>
              >)
            : doc.limits)
        : {},

      pricing: {
        monthly: doc.pricing.monthly,

        yearly: doc.pricing.yearly,

        currency: doc.pricing.currency,
      },

      stripe: doc.stripe
        ? {
            ...(doc.stripe.productId && {
              productId: doc.stripe.productId,
            }),

            ...(doc.stripe.monthlyPriceId && {
              monthlyPriceId: doc.stripe.monthlyPriceId,
            }),

            ...(doc.stripe.yearlyPriceId && {
              yearlyPriceId: doc.stripe.yearlyPriceId,
            }),
          }
        : undefined,

      createdAt: doc.createdAt,

      updatedAt: doc.updatedAt,
    };
  }

  protected toDocument(
    data: Partial<PlanEntity>,
  ): Partial<PlanDocument> {
    const doc: Partial<PlanDocument> = {};

    if (data.name !== undefined) doc.name = data.name;

    if (data.slug !== undefined) doc.slug = data.slug;

    if (data.description !== undefined)
      doc.description = data.description;

    if (data.isActive !== undefined)
      doc.isActive = data.isActive;

    if (data.isPublic !== undefined)
      doc.isPublic = data.isPublic;

    if (data.sortOrder !== undefined)
      doc.sortOrder = data.sortOrder;

    if (data.features !== undefined)
      doc.features = data.features;

    if (data.limits !== undefined) {
      doc.limits = new Map(
        Object.entries(data.limits),
      ) as unknown as Partial<Record<LimitKey, number>>;
    }

    if (data.pricing !== undefined) {
      doc.pricing = {
        monthly: data.pricing.monthly,

        yearly: data.pricing.yearly,

        currency: data.pricing.currency,
      };
    }

    if (data.stripe !== undefined) {
      doc.stripe = {
        ...(data.stripe.productId && {
          productId: data.stripe.productId,
        }),

        ...(data.stripe.monthlyPriceId && {
          monthlyPriceId: data.stripe.monthlyPriceId,
        }),

        ...(data.stripe.yearlyPriceId && {
          yearlyPriceId: data.stripe.yearlyPriceId,
        }),
      };
    }

    return doc;
  }

  protected leanToEntity(doc: PlanLeanDoc): PlanEntity {
    return {
      id: doc._id.toString(),

      name: doc.name,

      slug: doc.slug,

      ...(doc.description !== undefined
        ? { description: doc.description }
        : {}),

      isActive: doc.isActive,

      isPublic: doc.isPublic,

      sortOrder: doc.sortOrder,

      features: doc.features,

      limits: doc.limits
        ? (doc.limits instanceof Map
            ? (Object.fromEntries(doc.limits) as Partial<
                Record<LimitKey, number>
              >)
            : doc.limits)
        : {},

      pricing: {
        monthly: doc.pricing.monthly,

        yearly: doc.pricing.yearly,

        currency: doc.pricing.currency,
      },

      stripe: doc.stripe
        ? {
            ...(doc.stripe.productId && {
              productId: doc.stripe.productId,
            }),

            ...(doc.stripe.monthlyPriceId && {
              monthlyPriceId: doc.stripe.monthlyPriceId,
            }),

            ...(doc.stripe.yearlyPriceId && {
              yearlyPriceId: doc.stripe.yearlyPriceId,
            }),
          }
        : undefined,

      createdAt: doc.createdAt,

      updatedAt: doc.updatedAt,
    };
  }
}