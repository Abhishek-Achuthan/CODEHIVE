import { UserEntity } from '../../domain/entities/UserEntity';
import { IUserListResponseDTO, IUserLoginResponseDTO } from '../dto/UserDTO';

export class UserMapper {
  public static toLoginResponse(
    user: UserEntity,
    accessToken: string,
    refreshToken: string
  ): IUserLoginResponseDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isBlocked: user.isBlocked,
      phone: user.phone??'',
      role: user.role,
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

    public static toUserListResponse(user: UserEntity): IUserListResponseDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone??'',
      role: user.role,
      isBlocked: user.isBlocked,
    };
  }

  public static toUserListArray(users: UserEntity[]): IUserListResponseDTO[] {
    return users.map((user) => this.toUserListResponse(user));
  }

}
