import { inject, injectable } from 'tsyringe';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IWarnUserUseCase } from '../interface/admin/IWarnUserUseCase';

@injectable()
export class WarnUserUseCase implements IWarnUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, reason: string) {
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
