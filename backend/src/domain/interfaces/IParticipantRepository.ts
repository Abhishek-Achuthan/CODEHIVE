import { ParticipantEntity } from "../entities/room/ParticipantEntity";
import { IGenericRepository } from "./IGenericRepository";

export interface IParticipantRepository extends IGenericRepository<ParticipantEntity> {
  findByRoomAndUser(
    roomId: string,
    userId: string
  ): Promise<ParticipantEntity | null>;

  findByRoomId(roomId: string): Promise<ParticipantEntity[]>;

  countByRoomId(roomId: string): Promise<number>;
}