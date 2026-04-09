import { ParticipantEntity } from "../entities/room/ParticipantEntity";
import { IGenericRepository } from "./IGenericRepository";
import { ParticipantWithUser } from "../types/ParticipantWithUser";

export interface IParticipantRepository extends IGenericRepository<ParticipantEntity> {
  findByRoomAndUser(
    roomId: string,
    userId: string
  ): Promise<ParticipantEntity | null>;

  findByRoomId(roomId: string): Promise<ParticipantEntity[]>;

  findByRoomIdWithUsers(roomId: string): Promise<ParticipantWithUser[]>;

  countByRoomId(roomId: string): Promise<number>;

  removeByRoomAndUser(roomId: string, userId: string): Promise<void>;

  removeAllByUser(userId: string): Promise<string[]>;
}