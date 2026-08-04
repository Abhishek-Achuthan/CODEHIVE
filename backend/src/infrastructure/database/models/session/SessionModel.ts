import mongoose from 'mongoose';
import { SessionDoc, SessionSchema } from '../../schemas/session/SessionSchema';

export const SessionModel = mongoose.model<SessionDoc>('Session', SessionSchema);
