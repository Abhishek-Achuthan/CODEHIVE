
import { model } from 'mongoose';
import { MentorAvailabilityDoc, MentorAvailabilitySchema } from '../../schemas/session/MentorAvailabilitySchema';


export const MentorAvailabilityModel = model<MentorAvailabilityDoc>(
  'MentorAvailability',
  MentorAvailabilitySchema
);