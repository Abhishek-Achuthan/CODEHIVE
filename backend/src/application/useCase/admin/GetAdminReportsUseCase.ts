import { inject, injectable } from 'tsyringe';
import type { IRoomReportRepository } from '../../../domain/interfaces/IRoomReportRepository';

export interface IGetAdminReportsUseCase {
  execute(page: number, limit: number): Promise<{ data: any[]; total: number; page: number; limit: number }>;
}

@injectable()
export class GetAdminReportsUseCase implements IGetAdminReportsUseCase {
  constructor(
    @inject('IRoomReportRepository')
    private readonly roomReportRepository: IRoomReportRepository,
  ) {}

  async execute(page: number, limit: number): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.roomReportRepository.findAllWithDetails(page, limit);
    return { data, total, page, limit };
  }
}
