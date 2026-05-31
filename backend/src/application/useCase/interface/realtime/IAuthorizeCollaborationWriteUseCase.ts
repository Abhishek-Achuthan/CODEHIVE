import { AuthorizeCollaborationAccessDTO } from '../../../dto/CollaborationDTO';

export interface IAuthorizeCollaborationWriteUseCase {
  execute(data: AuthorizeCollaborationAccessDTO): Promise<void>;
}
