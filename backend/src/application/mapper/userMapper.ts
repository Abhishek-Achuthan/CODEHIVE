import { UserEntity } from '../../domain/entities/UserEntity';
import { IUserListResponseDTO, IUserLoginResponseDTO, IUserProfileResponseDTO } from '../dto/UserDTO';

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
      about: user.about,
      skills: user.skills,
      experience: user.experience,
      avatarUrl: user.avatarUrl,
      githubUrl: user.githubUrl,
      linkedInUrl: user.linkedInUrl,
      websiteUrl: user.websiteUrl,
      isBlocked: user.isBlocked,
      phone: user.phone ?? '',
      role: user.role,
      mentorAppliedAt: user.mentorAppliedAt,
      mentorStatus: user.mentorStatus,
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
      phone: user.phone ?? '',
      role: user.role,
      isBlocked: user.isBlocked,
    };
  }

  public static toUserProfileResponse(
    user: UserEntity
  ): IUserProfileResponseDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      about: user.about,
      skills: user.skills,
      experience: user.experience,
      avatarUrl: user.avatarUrl,
      githubUrl: user.githubUrl,
      linkedInUrl: user.linkedInUrl,
      websiteUrl: user.websiteUrl,
      mentorStatus: user.mentorStatus,
    };
  }

  public static toUserListArray(users: UserEntity[]): IUserListResponseDTO[] {
    return users.map((user) => this.toUserListResponse(user));
  }

}
