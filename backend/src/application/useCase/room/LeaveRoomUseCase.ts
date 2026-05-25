import { inject, injectable } from 'tsyringe';
import { ILeaveRoomUseCase } from '../interface/room/ILeaveRoomUseCase';
import { JoinRoomDTO } from '../../dto/RoomDTO';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';

@injectable()
export class LeaveRoomUseCase implements ILeaveRoomUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,
    @inject('IParticipantRepository')
    private readonly participantRepository: IParticipantRepository,
  ) {}

  async execute(data: JoinRoomDTO): Promise<void> {
    const room = await this.roomRepository.find(data.roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const existing = await this.participantRepository.findByRoomAndUser(
      data.roomId,
      data.userId,
    );

    if (!existing) {
      return;
    }
 
    await this.participantRepository.removeByRoomAndUser(data.roomId, data.userId);

    await this.roomRepository.decrementParticipantCount(data.roomId);
  }
}
