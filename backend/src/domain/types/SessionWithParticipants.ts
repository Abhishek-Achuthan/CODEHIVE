import { SessionEntity } from '../session/SessionEntity';
import { EssentialUserInfo } from './EssentialUserInfo';

export interface SessionWithParticipants {
    session: SessionEntity;
    mentor: EssentialUserInfo;
    user: EssentialUserInfo;
}
