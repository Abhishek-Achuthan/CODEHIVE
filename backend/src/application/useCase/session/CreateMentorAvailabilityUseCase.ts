import { inject, injectable } from 'tsyringe';
import { ICreateMentorAvailabilityUseCase } from '../interface/session/ICreateMentorAvailabilityUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { MentorAvailabilityEntity } from '../../../domain/session/MentorAvailabilityEntity';
import { CreateMentorAvailabilityDTO } from '../../dto/SessionDTO';



@injectable()
export class CreateMentorAvailabilityUseCase implements ICreateMentorAvailabilityUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository') private readonly _mentorAvailabilityRepository:IMentorAvailabilityRepository
    ){}

    async execute(input: CreateMentorAvailabilityDTO): Promise<MentorAvailabilityEntity> {
        
        return this._mentorAvailabilityRepository.create(
           { ...input,
            isActive:true}
        )
    }
}