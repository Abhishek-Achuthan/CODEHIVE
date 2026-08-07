import { inject, injectable } from 'tsyringe';
import type { IRoomReportRepository } from '../../../domain/interfaces/IRoomReportRepository';
import type {
  GetAdminReportsResult,
  IGetAdminReportsUseCase,
} from '../interface/admin/IGetAdminReportsUseCase';

@injectable()
export class GetAdminReportsUseCase implements IGetAdminReportsUseCase {
  constructor(
    @inject('IRoomReportRepository')
    private readonly roomReportRepository: IRoomReportRepository,
  ) {}

  async execute(page: number, limit: number): Promise<GetAdminReportsResult> {
    const { data, total } = await this.roomReportRepository.findAllWithDetails(page, limit);
    return { data, total, page, limit };
  }
}
