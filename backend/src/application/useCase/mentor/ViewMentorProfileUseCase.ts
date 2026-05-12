import { injectable,inject } from 'tsyringe';
import { IViewMentorProfileUseCase } from '../interface/mentor/IViewMentorProfileUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { SessionMapper } from '../../mapper/SessionMapper';
import { IMentorProfileResponseDTO } from '../../dto/SessionDTO';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import type { ICacheService } from '../../ports/cache/ICacheService';


@injectable()
export class ViewMentorProfileUseCase implements IViewMentorProfileUseCase {
    constructor(
        @inject('IUserRepository') private readonly userRepository : IUserRepository,
        @inject('ICacheService') private readonly cacheService : ICacheService
    ){}

    async execute(id: string): Promise<IMentorProfileResponseDTO> {
        const cacheKey = `mentor:profile:${id}`;

        const cached = await this.cacheService.getData(cacheKey);

        if(cached) return JSON.parse(cached) as IMentorProfileResponseDTO

        const user = await this.userRepository.find(id);

        if(!user || user.role !== UserRole.MENTOR || user.mentorStatus !== MentorStatus.APPROVED){
            throw new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN);
        }

        const result =  SessionMapper.toMentorProfile(user);

        this.cacheService.setData(cacheKey,300,JSON.stringify(result));

        return result
    }
}
