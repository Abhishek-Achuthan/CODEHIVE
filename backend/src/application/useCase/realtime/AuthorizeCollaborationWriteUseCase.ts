import { inject, injectable } from 'tsyringe';
import { AuthorizeCollaborationAccessDTO } from '../../dto/CollaborationDTO';
import { IAuthorizeCollaborationWriteUseCase } from '../interface/realtime/IAuthorizeCollaborationWriteUseCase';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';

@injectable()
export class AuthorizeCollaborationWriteUseCase
  implements IAuthorizeCollaborationWriteUseCase
{
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: AuthorizeCollaborationAccessDTO): Promise<void> {
    await this._roomAuthorizationService.assertCollaborationWriteAccess(
      data.userId,
      data.documentName,
    );
  }
}
