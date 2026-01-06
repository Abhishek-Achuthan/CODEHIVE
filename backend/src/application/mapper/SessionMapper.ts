import { SessionEntity } from '../../domain/session/SessionEntity';
import { ISessionResponseDTO } from '../dto/SessionDTO';

export class SessionMapper {
  static toResponse(session: SessionEntity): ISessionResponseDTO {
    return {
      id: session.id,
      mentorId: session.mentorId,
      userId: session.userId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
    };
  }

  static toResponseArray(
    sessions: SessionEntity[]
  ): ISessionResponseDTO[] {
    return sessions.map(this.toResponse);
  }
}
