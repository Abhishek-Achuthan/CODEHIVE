import { inject, injectable } from 'tsyringe';
import { IReportParticipantUseCase } from '../interface/room/IReportParticipantUseCase';
import type { IRoomReportRepository } from '../../../domain/interfaces/IRoomReportRepository';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class ReportParticipantUseCase implements IReportParticipantUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
    @inject('IRoomReportRepository')
    private readonly _roomReportRepository: IRoomReportRepository,
  ) {}

  async execute(
    roomId: string,
    reporterId: string,
    reportedUserId: string,
    reason: string,
    description?: string,
  ): Promise<void> {
    await this._roomAuthorizationService.assertParticipant(roomId, reporterId, 'read');

    const participant = await this._participantRepository.findByRoomAndUser(roomId, reportedUserId);
    if (!participant) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.PARTICIPANT_NOT_FOUND);
    }

    await this._roomReportRepository.create({
      roomId,
      reporterId,
      reportedUserId,
      reason,
      ...(description !== undefined ? { description } : {}),
    });
  }
}
