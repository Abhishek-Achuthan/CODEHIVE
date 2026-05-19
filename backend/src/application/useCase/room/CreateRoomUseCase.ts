import { inject, injectable } from 'tsyringe';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { ICreateRoomUseCase } from '../interface/room/ICreateRoomUseCase';
import { CreateRoomDTO, CreateRoomResponseDTO } from '../../dto/RoomDTO';
import { ParticipantEntity } from '../../../domain/entities/room/ParticipantEntity';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';
import { RoomAdmissionPolicy } from '../../../domain/types/RoomAdmissionPolicy';
import { RoomType } from '../../../domain/types/RoomType';
import { RoomRole } from '../../../domain/types/RoomRole';

@injectable()
export class CreateRoomUseCase implements ICreateRoomUseCase {
  constructor(
    @inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    @inject('IParticipantRepository')
    private readonly participantRepository: IParticipantRepository,
  ) { }
  async execute(data: CreateRoomDTO): Promise<CreateRoomResponseDTO> {
    const room = await this.roomRepository.create({
      title: data.title,
      hostId: data.userId,
      visibility: data.visibility,
      type: RoomType.CUSTOM,
      participantCount: 1,
      maxParticipants: 10,
      featureSnapshot: null,
      lifecycleStatus: RoomLifeCycleStatus.ACTIVE,
      admissionPolicy: RoomAdmissionPolicy.REQUEST_TO_JOIN,
      ...(data.description && { description: data.description }),
    });
    try {
      const participant: ParticipantEntity = {
        id: '',
        roomId: room.id,
        userId: data.userId,
        role: RoomRole.HOST,
        overrides: {},
        joinedAt: new Date(),
      };

      await this.participantRepository.create(participant);

      return room;
    } catch (error) {
      await this.roomRepository.delete(room.id);
      throw error;
    }
  }
}
