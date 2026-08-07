import { UserEntity } from '../../../../domain/entities/UserEntity';

export interface IBanUserUseCase {
  execute(userId: string, durationInDays: number | null, reason: string, bannedBy: string): Promise<UserEntity>;
}
