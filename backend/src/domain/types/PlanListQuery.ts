import { PaginationParams } from './PaginationParams';

export interface PlanListQuery extends PaginationParams {
  isActive?: boolean | undefined;
  isPublic?: boolean | undefined;
}
