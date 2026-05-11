import { PlanEntity } from '../entities/PlanEntity';
import { IGenericRepository } from './IGenericRepository';

export interface IPlanRepository extends IGenericRepository<PlanEntity> {
  findAllActive(): Promise<PlanEntity[]>;
  findByName(name: string): Promise<PlanEntity | null>;
}
