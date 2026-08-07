import { inject, injectable } from 'tsyringe';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import type { IBanUserUseCase } from '../interface/admin/IBanUserUseCase';

@injectable()
export class BanUserUseCase implements IBanUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, durationInDays: number | null, reason: string, bannedBy: string) {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.isBlocked = true;
    user.banReason = reason;
    user.bannedAt = new Date();
    user.bannedBy = bannedBy;

    if (durationInDays) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + durationInDays);
      user.banExpirationDate = expirationDate;
    } else {
      user.banExpirationDate = null;
    }

    const updatedUser = await this.userRepository.update(userId, user);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    
    return updatedUser;
  }
}
