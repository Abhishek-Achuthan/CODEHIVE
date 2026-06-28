import { inject, injectable } from 'tsyringe';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { UserEntity } from '../../../domain/entities/UserEntity';

export interface IWarnUserUseCase {
  execute(userId: string, reason: string): Promise<UserEntity>;
}

@injectable()
export class WarnUserUseCase implements IWarnUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, reason: string): Promise<UserEntity> {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.warnCount = (user.warnCount || 0) + 1;
    // We could store the reason in a warning history array, but for now we just increment.
    
    const updatedUser = await this.userRepository.update(userId, user);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    
    return updatedUser;
  }
}
