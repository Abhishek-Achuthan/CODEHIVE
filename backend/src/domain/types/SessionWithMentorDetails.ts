import { SessionEntity } from '../session/SessionEntity';
import { EssentialUserInfo } from './EssentialUserInfo';

export interface SessionWithMentorDetails {
    session: SessionEntity,
    user: EssentialUserInfo
}