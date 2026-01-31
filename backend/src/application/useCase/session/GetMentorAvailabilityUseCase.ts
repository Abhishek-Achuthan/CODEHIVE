import { inject,injectable } from 'tsyringe';
import { IGetMentorAvailabilityUseCase } from '../interface/session/IGetMentorAvailabilityUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';


@injectable()
export class GetMentorAvailabilityUseCase implements IGetMentorAvailabilityUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository') private readonly _mentorRepository:IMentorAvailabilityRepository
    ){}

    async execute(mentorId: string): Promise<MentorAvailabilityEntity[]> {
        const availabilities =  await this._mentorRepository.findByMentor(mentorId);
        
        return availabilities;
    }
}