import { inject, injectable } from 'tsyringe';
import { ILeaveRoomUseCase } from '../interface/room/ILeaveRoomUseCase';
import { JoinRoomDTO } from '../../dto/RoomDTO';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class LeaveRoomUseCase implements ILeaveRoomUseCase {
    constructor(
        @inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
        @inject('IParticipantRepository') private readonly participantRepository: IParticipantRepository,
    ) {}

    async execute(data: JoinRoomDTO): Promise<void> {
        const room = await this.roomRepository.find(data.roomId);
        if (!room) {
            throw new Error(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
        }

        const existing = await this.participantRepository.findByRoomAndUser(data.roomId, data.userId);
        if (!existing) {
            return; // Already left
        }

        await this.participantRepository.removeByRoomAndUser(data.roomId, data.userId);

        // Fetch real count after removal to synchronize perfectly
        const newCount = await this.participantRepository.countByRoomId(data.roomId);
        
        await this.roomRepository.update(room.id, {
            participantCount: newCount,
        });

    }
}
