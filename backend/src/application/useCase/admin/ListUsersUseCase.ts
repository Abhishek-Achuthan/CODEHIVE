import { inject, injectable } from 'tsyringe';
import { IListUsersUseCase } from '../interface/admin/IListUsersUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserRole } from '../../../domain/types/UserRole';
import { UserMapper } from '../../mapper/UserMapper';
import { IUserListResponseDTO } from '../../dto/UserDTO';
import { PaginationResult } from '../../../domain/types/PaginationResult';

@injectable()
export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    @inject('IUserRepository') private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    role: UserRole,
    currentPage?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<PaginationResult<IUserListResponseDTO>> {
    const {items,totalItems,totalPages} = await this._userRepository.getAllUsers(
      role,
      currentPage,
      pageSize,
      sort,
      search
    );

    const mappedUsers = UserMapper.toUserListArray(items);

    return {
      items: mappedUsers,
      totalItems,
      totalPages
    }
  }
}
