import { Model, Types } from "mongoose";
import { RoomEntity } from "../../../domain/entities/room/RoomEntity";
import { RoomDoc } from "../schemas/room/RoomSchema";
import { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import { RoomModel } from "../models/room/RoomModel";
import { injectable } from "tsyringe";

@injectable()
export class RoomRepository implements IRoomRepository {

    private readonly _model : Model<RoomDoc>
    
  constructor() {
    this._model = RoomModel
  }

async create(room: RoomEntity): Promise<RoomEntity> {
  const doc = await this._model.create(this.toDocument(room));
  return this.toEntity(doc);
}

async findById(id: string): Promise<RoomEntity | null> {
  const doc = await this._model.findById(id);
  return doc ? this.toEntity(doc) : null;
}

async findBySessionId(sessionId: string): Promise<RoomEntity | null> {
  const doc = await this._model.findOne({ sessionId });
  return doc ? this.toEntity(doc) : null;
}
/**
 * 
 * @param room 
 * @returns RoomEntity
 * 
 * Otherwise throws error Reason to do this is a 
 * clear techinical invariant so
 * should throw error
 */
async update(room: RoomEntity): Promise<RoomEntity> {
  const doc = await this._model.findByIdAndUpdate(
    room.id,
    this.toDocument(room),
    { new: true }
  );

  if (!doc) {
    throw new Error("Room not found"); 
  }

  return this.toEntity(doc);
}


  // ---------- mapping ----------

  private toEntity(doc: RoomDoc): RoomEntity {
    return {
      id: doc._id.toString(),
      type: doc.type,
      ownerId: doc.ownerId.toString(),
      status: doc.status,
      participants: doc.participants,
      createdAt: doc.createdAt,
      ...(doc.sessionId && {sessionId: doc.sessionId.toString()}),
      ...(doc.mentorId  && {mentorId: doc.mentorId.toString()}),
      ...(doc.startedAt && {startedAt : doc.startedAt}),
      ...(doc.endedAt && {endedAt : doc.endedAt}),
    };
  }

  private toDocument(room: RoomEntity): Partial<RoomDoc> {
    return {
      type: room.type,
      ownerId: new Types.ObjectId(room.ownerId),
      status: room.status,
      participants: room.participants,
      ...(room.sessionId && {sessionId: new Types.ObjectId(room.sessionId)}),
      ...(room.mentorId && {mentorId: new Types.ObjectId(room.mentorId)}),
      ...(room.startedAt && {startedAt : room.startedAt}),
      ...(room.endedAt && {endedAt : room.endedAt}),
    };
  }
}
