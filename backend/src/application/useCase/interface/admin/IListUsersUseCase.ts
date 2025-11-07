import { UserRole } from '../../../../domain/types/UserRole';
import { IUserListResponseDTO } from '../../../dto/UserDTO';

export interface IListUsersUseCase {
  execute(
    role: UserRole,
    currentPage?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<{users :IUserListResponseDTO[];totalItems:number,totalPages:number}>;
}
