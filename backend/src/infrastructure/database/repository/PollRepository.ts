import { Model, Types } from "mongoose";
import PollModel from "../models/room/PollModel";
import { GenericRepository } from "./GenericRepository";
import { leanPollDocument, PollDocument } from "../schemas/room/PollSchema";
import { PollEntity } from "../../../domain/entities/room/PollEntity";
import { IPollRepository } from "../../../domain/interfaces/IPollRepository";
import { SubmitPollVote } from "../../../domain/types/SubmitPollVote";

type PollOptionPersistence = {
  id: string;
  text: string;
  votedUserIds: string[];
};

type PollPersistence = Partial<Record<keyof PollDocument, unknown>> & {
  options?: PollOptionPersistence[];
};

export class PollRepository extends GenericRepository<PollDocument, PollEntity> implements IPollRepository {

  constructor() {
    super(PollModel as Model<PollDocument>);
  }

  async findActivePollByRoomId(roomId: string): Promise<PollEntity | null> {
    const doc = await this._model.findOne({
      roomId: new Types.ObjectId(roomId),
      isActive: true,
    }).sort({ createdAt: -1 });

    return doc ? this.toEntity(doc as PollDocument) : null;
  }

  async submitVote(data: SubmitPollVote): Promise<PollEntity> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(data.pollId) },
      { $pull: { "options.$[].votedUserIds": data.userId } }
    );

    const updated = await this._model.findByIdAndUpdate(
      data.pollId,
      {
        $addToSet: { "options.$[elem].votedUserIds": data.userId }
      },
      {
        arrayFilters: [{ "elem.id": { $in: data.optionIds } }],
        new: true
      }
    );

    if (!updated) {
      throw new Error("Poll not found");
    }

    return this.toEntity(updated as PollDocument);
  }

  async closePoll(pollId: string): Promise<void> {
    await this._model.findByIdAndUpdate(pollId, { isActive: false });
  }

  protected toEntity(doc: PollDocument): PollEntity {
    return {
      id: doc._id.toString(),
      roomId: doc.roomId.toString(),
      question: doc.question,
      options: doc.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          votes: opt.votedUserIds
        })),
        createdBy: doc.createdBy.toString(),
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        ...(doc.allowMultiple !== undefined && {allowMultiple : doc.allowMultiple}),
        ...(doc.expiresAt !== undefined && {expiresAt: doc.expiresAt}),
        ...(doc.updatedAt && {updatedAt: doc.updatedAt}),
    };
  }

  protected toDocument(data: Partial<PollEntity>): Partial<PollDocument> {
    const doc: PollPersistence = {};

    if (data.roomId !== undefined) doc.roomId = new Types.ObjectId(data.roomId);
    if (data.question !== undefined) doc.question = data.question;
    if (data.options !== undefined) {
      doc.options = data.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votedUserIds: opt.votes
      }));
    }
    if (data.createdBy !== undefined) doc.createdBy = new Types.ObjectId(data.createdBy);
    if (data.isActive !== undefined) doc.isActive = data.isActive;
    if (data.allowMultiple !== undefined) doc.allowMultiple = data.allowMultiple;
    if (data.expiresAt !== undefined) doc.expiresAt = data.expiresAt;

    return doc as Partial<PollDocument>;
  }

  public leanToEntity(doc: leanPollDocument): PollEntity {
    return {
      id: doc.id,
      question: doc.question,
      roomId: doc.roomId.toString(),
      options: doc.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votedUserIds
      })),
      createdBy: doc.createdBy.toString(),
      isActive: doc.isActive,
      ...(doc.allowMultiple !== undefined && {allowMultiple: doc.allowMultiple}),
      ...(doc.expiresAt !== undefined && {expiresAt: doc.expiresAt}),
      ...(doc.createdAt && {createdAt: doc.createdAt}),
      ...(doc.updatedAt && {updatedAt: doc.updatedAt}),
    };
  }
}
