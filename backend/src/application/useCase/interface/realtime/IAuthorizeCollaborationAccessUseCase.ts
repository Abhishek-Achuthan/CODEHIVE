import { AuthorizeCollaborationAccessDTO } from '../../../dto/CollaborationDTO';

export interface IAuthorizeCollaborationAccessUseCase {
  execute(data: AuthorizeCollaborationAccessDTO): Promise<void>;
}
