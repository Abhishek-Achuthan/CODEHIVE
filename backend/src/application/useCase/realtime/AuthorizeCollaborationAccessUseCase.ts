import { inject, injectable } from 'tsyringe';

import { AuthorizeCollaborationAccessDTO } from '../../dto/CollaborationDTO';
import { IAuthorizeCollaborationAccessUseCase } from '../interface/realtime/IAuthorizeCollaborationAccessUseCase';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IParticipantRepository } from '../../../domain/interfaces/IParticipantRepository';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class AuthorizeCollaborationAccessUseCase
  implements IAuthorizeCollaborationAccessUseCase
{
  constructor(
    @inject('IRoomRepository') private readonly _roomRepository: IRoomRepository,
    @inject('IParticipantRepository')
    private readonly _participantRepository: IParticipantRepository,
  ) {}

  async execute(data: AuthorizeCollaborationAccessDTO): Promise<void> {
    const documentTarget = this.parseDocumentName(data.documentName);

    if (documentTarget.type !== 'room') {
      throw new BadRequestError(ERROR_MESSAGES.COLLABORATION.INVALID_DOCUMENT_NAME);
    }

    const room = await this._roomRepository.find(documentTarget.resourceId);

    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    if (room.hostId === data.userId) {
      return;
    }

    const participant = await this._participantRepository.findByRoomAndUser(
      room.id,
      data.userId
    );

    if (participant) {
      return;
    }


    throw new ForbiddenError(ERROR_MESSAGES.ROOM.ACCESS_DENIED);
  }

  private parseDocumentName(documentName: string): {
    type: string;
    resourceId: string;
  } {
    const [type, resourceId] = documentName.split(':');

    if (!type || !resourceId) {
      throw new BadRequestError(ERROR_MESSAGES.COLLABORATION.INVALID_DOCUMENT_NAME);
    }

    return { type, resourceId };
  }
}
