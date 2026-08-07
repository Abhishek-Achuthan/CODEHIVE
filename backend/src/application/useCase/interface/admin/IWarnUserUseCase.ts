import { UserEntity } from '../../../../domain/entities/UserEntity';

export interface IWarnUserUseCase {
  execute(userId: string, reason: string): Promise<UserEntity>;
}
