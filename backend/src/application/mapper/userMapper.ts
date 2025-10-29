import { UserEntity } from "../../domain/entities/UserEntity";
import { IUserLoginResponseDTO } from "../dto/UserDTO";

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
      phone: user.phone,
      role: user.role,
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }
}
