import { PlanEntity } from '../entities/PlanEntity';
import { PaginationResult } from '../types/PaginationResult';
import { IGenericRepository } from './IGenericRepository';
import { PaginationParams } from '../types/PaginationParams';
import { PlanListQuery } from '../types/PlanListQuery';

export interface IPlanRepository extends IGenericRepository<PlanEntity> {
  findBySlug(slug: string): Promise<PlanEntity | null>;
  findAllActive(params: PaginationParams): Promise<PaginationResult<PlanEntity>>;
  findAllPlans(query: PlanListQuery): Promise<PaginationResult<PlanEntity>>;
}