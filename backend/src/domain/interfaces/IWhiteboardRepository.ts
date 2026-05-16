import { WhiteboardEntity } from "../entities/room/WhiteboardEntity";

export interface IWhiteboardRepository {
  findByRoomId(roomId: string): Promise<WhiteboardEntity | null>;

  save(whiteboard: WhiteboardEntity): Promise<WhiteboardEntity>;

  deleteByRoomId(roomId: string): Promise<void>;
}