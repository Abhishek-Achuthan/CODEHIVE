import { Model, Types } from 'mongoose';
import { GenericRepository } from './GenericRepository';
import { MentorAvailabilityDoc } from '../schemas/session/MentorAvailabilitySchema';
import { MentorAvailablityEntity } from '../../../domain/session/MentorAvailablityEntity';
import { IMentorAvailablityRepository } from '../../../domain/interfaces/IMentorAvailablityRepository';

export class MentorAvailabilityRepository
  extends GenericRepository<MentorAvailabilityDoc, MentorAvailablityEntity>
  implements IMentorAvailablityRepository
{
  constructor(model: Model<MentorAvailabilityDoc>) {
    super(model);
  }

  async findByMentor(mentorId: string): Promise<MentorAvailablityEntity[]> {
    const doc = await this._model.find({
      mentorId: new Types.ObjectId(mentorId),
      isActive: true,
    });

    return doc.map((d) => this.toEntity(d));
  }

  async deactivate(id: string): Promise<MentorAvailablityEntity | null> {
    const updated = await this._model.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return updated ? this.toEntity(updated) : null;
  }

  protected toDocument(
    data: Partial<MentorAvailablityEntity>
  ): Partial<MentorAvailabilityDoc> {
    const doc: Partial<MentorAvailabilityDoc> = {};
    if (data.mentorId) doc.mentorId = new Types.ObjectId(data.mentorId);
    if (data.rrule !== undefined) doc.rrule = data.rrule;
    if (data.slotDurationMinutes !== undefined)
      doc.slotDurationMinutes = data.slotDurationMinutes;
    if (data.startTime !== undefined) doc.startTime = data.startTime;
    if (data.endTime !== undefined) doc.endTime = data.endTime;
    if (data.isActive !== undefined) doc.isActive = data.isActive;
    if (data.bufferMinutes !== undefined)
      doc.bufferMinutes = data.bufferMinutes;
    return doc;
  }

  protected toEntity(doc: MentorAvailabilityDoc): MentorAvailablityEntity {
    return {
      id: doc.id,
      mentorId: doc.mentorId.toString(),
      rrule: doc.rrule,
      slotDurationMinutes: doc.slotDurationMinutes,
      startTime: doc.startTime,
      endTime: doc.endTime,
      isActive: doc.isActive,
      bufferMinutes: doc.bufferMinutes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
