import { inject, injectable } from "tsyringe";
import type { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import { ICreateRoomUseCase } from "../interface/room/ICreateRoomUseCase";
import { CreateRoomDTO, CreateRoomResponseDTO } from "../../dto/RoomDTO";
import { ParticipantEntity } from "../../../domain/entities/room/ParticipantEntity";
import type { IParticipantRepository } from "../../../domain/interfaces/IParticipantRepository";

@injectable()
export class CreateRoomUseCase implements ICreateRoomUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("ParticipantRepository")
    private readonly participantRepository: IParticipantRepository,
  ) {}
  async execute(data: CreateRoomDTO): Promise<CreateRoomResponseDTO> {
    const room = await this.roomRepository.create({
      title: data.title,
      hostId: data.userId,
      visibility: data.visibility,
      type: "CUSTOM",
      participantCount: 1,
      maxParticipants: 10,
      ...(data.description && { description: data.description }),
    });
    try {
      const participant: ParticipantEntity = {
        id: "",
        roomId: room.id,
        userId: data.userId,
        role: "HOST",
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
