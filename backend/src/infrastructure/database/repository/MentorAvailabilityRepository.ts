import { Model, Types } from 'mongoose';
import { GenericRepository } from './GenericRepository';
import { MentorAvailabilityDoc } from '../schemas/session/MentorAvailabilitySchema';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { injectable } from 'tsyringe';
import { MentorAvailabilityModel } from '../models/session/MentorAvailablityModel';

@injectable()
export class MentorAvailabilityRepository
  extends GenericRepository<MentorAvailabilityDoc, MentorAvailabilityEntity>
  implements IMentorAvailabilityRepository {
  constructor() {
    super(MentorAvailabilityModel as Model<MentorAvailabilityDoc>);
  }

  async findByMentor(mentorId: string): Promise<MentorAvailabilityEntity[]> {
    const doc = await this._model.find({
      mentorId: new Types.ObjectId(mentorId),
      isActive: true,
    });

    return doc.map((d) => this.toEntity(d));
  }

  async deactivate(id: string): Promise<MentorAvailabilityEntity | null> {
    const updated = await this._model.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return updated ? this.toEntity(updated) : null;
  }

  async addException(id: string, exdate: string): Promise<MentorAvailabilityEntity | null> {
    const updated = await this._model.findByIdAndUpdate(
      id,
      { $addToSet: { exdates: exdate } },
      { new: true }
    );

    return updated ? this.toEntity(updated) : null;
  }

  protected toDocument(
    data: Partial<MentorAvailabilityEntity>
  ): Partial<MentorAvailabilityDoc> {
    const doc: Partial<MentorAvailabilityDoc> = {};
    if (data.mentorId) doc.mentorId = new Types.ObjectId(data.mentorId);
    if (data.rrule !== undefined) doc.rrule = data.rrule;
    if (data.exdates !== undefined) doc.exdates = data.exdates;
    if (data.slotDurationMinutes !== undefined)
      doc.slotDurationMinutes = data.slotDurationMinutes;
    if (data.startTime !== undefined) doc.startTime = data.startTime;
    if (data.endTime !== undefined) doc.endTime = data.endTime;
    if (data.isActive !== undefined) doc.isActive = data.isActive;
    if (data.bufferMinutes !== undefined)
      doc.bufferMinutes = data.bufferMinutes;
    if (data.slotPrice !== undefined) doc.slotPrice = data.slotPrice;
    return doc;
  }

  protected toEntity(doc: MentorAvailabilityDoc): MentorAvailabilityEntity {
    return {
      id: doc.id,
      mentorId: doc.mentorId.toString(),
      rrule: doc.rrule,
      exdates: doc.exdates || [],
      slotDurationMinutes: doc.slotDurationMinutes,
      startTime: doc.startTime,
      endTime: doc.endTime,
      isActive: doc.isActive,
      bufferMinutes: doc.bufferMinutes,
      slotPrice: doc.slotPrice,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
