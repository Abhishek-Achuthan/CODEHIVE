import { inject, injectable } from "tsyringe";
import { IJoinRoomUseCase } from "../interface/room/IJoinRoomUseCase";
import { JoinRoomDTO, JoinRoomResponseDTO } from "../../dto/RoomDTO";
import type { IParticipantRepository } from "../../../domain/interfaces/IParticipantRepository";
import type { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import { ParticipantEntity } from "../../../domain/entities/room/ParticipantEntity";

@injectable()
export class JoinRoomUseCase implements IJoinRoomUseCase {
    constructor(
        @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
        @inject("ParticipantRepository") private readonly participantRepository: IParticipantRepository,
    ) {}
    async execute(data: JoinRoomDTO): Promise<JoinRoomResponseDTO> {
        const room = await this.roomRepository.find(data.roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        const existing = await this.participantRepository.findByRoomAndUser(data.roomId,data.userId);

        if(existing) throw new Error("User is already a participant in this room");

        if(room.participantCount >= room.maxParticipants){
            throw new Error("Room is full");
        }
        
        const participant: ParticipantEntity = {
            id: "",
            roomId: data.roomId,
            userId: data.userId,
            role: "PARTICIPANT",
            joinedAt: new Date(),
        };
        const createdParticipant = await this.participantRepository.create(participant);

        await this.roomRepository.update(room.id, {
            participantCount: room.participantCount + 1,
        });

        return createdParticipant;
    }
}
