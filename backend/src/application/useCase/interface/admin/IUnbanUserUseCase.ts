import { UserEntity } from '../../../../domain/entities/UserEntity';

export interface IUnbanUserUseCase {
  execute(userId: string): Promise<UserEntity>;
}
