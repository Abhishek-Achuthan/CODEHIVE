import { inject,injectable } from 'tsyringe';
import { IGetMentorAvailabilityUseCase } from '../interface/session/IGetMentorAvailabilityUseCase';
import { type IMentorAvailablityRepository } from '../../../domain/interfaces/IMentorAvailablityRepository';
import { MentorAvailablityEntity } from '../../../domain/session/MentorAvailablityEntity';



@injectable()
export class GetMentorAvailabilityUseCase implements IGetMentorAvailabilityUseCase {
    constructor(
        @inject('IMentorAvailablityRepository') private readonly _mentorRepository:IMentorAvailablityRepository
    ){}

    async execute(mentorId: string): Promise<MentorAvailablityEntity[]> {
        const availability =  await this._mentorRepository.findByMentor(mentorId);
        
        return availability;
    }
}