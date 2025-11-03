import { UserEntity } from "../../../../domain/entities/UserEntity";
import { UserRole } from "../../../../domain/types/UserRole";

export interface IListUsersUseCase {
  execute(
    role: UserRole,
    currentPage?: number,
    pageSize?: number,
    sort?: string,
    search?: string
  ): Promise<UserEntity[]>;
}
