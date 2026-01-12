import { SessionDoc } from '../schemas/session/SessionSchema';
import { UserLeanDoc } from '../schemas/UserSchema';

export type PopulatedSessionDoc = Omit<SessionDoc, 'userId' | 'mentorId'> & {
    userId: UserLeanDoc;
    mentorId: UserLeanDoc;
}