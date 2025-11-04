import { inject, injectable } from "tsyringe";
import { IListUsersUseCase } from "../interface/admin/IListUsersUseCase";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserRole } from "../../../domain/types/UserRole";
import { UserMapper } from "../../mapper/userMapper";
import { IUserListResponseDTO } from "../../dto/UserDTO";

@injectable()
export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    @inject("IUserRepository") private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    role: UserRole,
    currentPage?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<IUserListResponseDTO[]> {
    const users = await this._userRepository.getAllUsers(
      role,
      currentPage,
      pageSize,
      sort,
      search
    );

    return UserMapper.toUserListArray(users);
  }
}
