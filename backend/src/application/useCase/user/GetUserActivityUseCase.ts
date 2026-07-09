import { inject, injectable } from 'tsyringe';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IGetUserActivityUseCase } from '../interface/user/IGetUserActivityUseCase';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserMapper } from '../../mapper/UserMapper';
import { type IUserActivityStatsDTO } from '../../dto/UserDTO';

@injectable()
export class GetUserActivityUseCase implements IGetUserActivityUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<IUserActivityStatsDTO> {
    if (!userId) {
      throw new BadRequestError(ERROR_MESSAGES.USER.ID_REQUIRED);
    }
    
    const stats = await this._userRepository.getUserActivityStats(userId);
    return UserMapper.toUserActivityStatsDTO(stats);
  }
}
