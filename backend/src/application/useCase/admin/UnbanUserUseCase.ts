import { inject, injectable } from 'tsyringe';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IUnbanUserUseCase } from '../interface/admin/IUnbanUserUseCase';

@injectable()
export class UnbanUserUseCase implements IUnbanUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.isBlocked = false;
    user.banExpirationDate = null;
    user.banReason = null;
    user.bannedAt = null;
    user.bannedBy = null;

    const updatedUser = await this.userRepository.update(userId, user);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    
    return updatedUser;
  }
}
