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

  async execute(userId: string, _reason: string) {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.warnCount = (user.warnCount || 0) + 1;
    
    const updatedUser = await this.userRepository.update(userId, user);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    
    return updatedUser;
  }
}
