import { inject, injectable } from 'tsyringe';
import type { IRoomReportRepository } from '../../../domain/interfaces/IRoomReportRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { RoomReportEntity } from '../../../domain/entities/room/RoomReportEntity';
import type { IUpdateReportStatusUseCase } from '../interface/admin/IUpdateReportStatusUseCase';

@injectable()
export class UpdateReportStatusUseCase implements IUpdateReportStatusUseCase {
  constructor(
    @inject('IRoomReportRepository')
    private readonly roomReportRepository: IRoomReportRepository,
  ) {}

  async execute(reportId: string, status: RoomReportEntity['status'], adminId?: string): Promise<RoomReportEntity> {
    if (!['PENDING', 'REVIEWED', 'RESOLVED'].includes(status)) {
      throw new Error('Invalid status');
    }

    const updated = await this.roomReportRepository.updateStatus(
      reportId, 
      status, 
      status === 'RESOLVED' ? adminId : undefined
    );
    
    if (!updated) {
      throw new NotFoundError('Report not found');
    }

    return updated;
  }
}
