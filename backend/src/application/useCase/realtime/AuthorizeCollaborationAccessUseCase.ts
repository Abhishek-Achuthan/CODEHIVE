import { inject, injectable } from 'tsyringe';
import { AuthorizeCollaborationAccessDTO } from '../../dto/CollaborationDTO';
import { IAuthorizeCollaborationAccessUseCase } from '../interface/realtime/IAuthorizeCollaborationAccessUseCase';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';

@injectable()
export class AuthorizeCollaborationAccessUseCase
  implements IAuthorizeCollaborationAccessUseCase
{
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async execute(data: AuthorizeCollaborationAccessDTO): Promise<void> {
    await this._roomAuthorizationService.assertCollaborationAccess(
      data.userId,
      data.documentName,
    );
  }
}
