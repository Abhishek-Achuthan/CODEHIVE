import { SessionEntity } from '../session/SessionEntity';
import { EssentialUserInfo } from './EssentialUserInfo';

export interface SessionWithUserDetails {
    session: SessionEntity,
    user: EssentialUserInfo
}