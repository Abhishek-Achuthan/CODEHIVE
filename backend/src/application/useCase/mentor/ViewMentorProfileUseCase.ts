import { injectable,inject } from 'tsyringe';
import { IViewMentorProfileUseCase } from '../interface/mentor/IViewMentorProfileUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { SessionMapper } from '../../mapper/SessionMapper';
import { IMentorProfileResponseDTO } from '../../dto/SessionDTO';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorStatus } from '../../../domain/types/MentorStatus';


@injectable()
export class ViewMentorProfileUseCase implements IViewMentorProfileUseCase {
    constructor(
        @inject('IUserRepository') private readonly userRepository : IUserRepository
    ){}

    async execute(id: string): Promise<IMentorProfileResponseDTO> {
        const user = await this.userRepository.find(id);

        if(!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
        if(!user || user.role !== UserRole.MENTOR || user.mentorStatus !== MentorStatus.APPROVED){
            throw new NotFoundError(ERROR_MESSAGES.SESSION.MENTOR_NOT_FOUND);
        }

        return SessionMapper.toMentorProfile(user);
    }
}