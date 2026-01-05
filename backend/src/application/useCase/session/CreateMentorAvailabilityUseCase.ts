import { inject, injectable } from 'tsyringe';
import { ICreateMentorAvailabiltyUseCase } from '../interface/session/ICreateMentorAvailabilityUseCase';
import { type IMentorAvailablityRepository } from '../../../domain/interfaces/IMentorAvailablityRepository';
import { MentorAvailablityEntity } from '../../../domain/session/MentorAvailablityEntity';
import { CreateMentorAvailailityDTO } from '../../dto/SessionDTO';





@injectable()
export class CreateMentorAvailabilityUseCase implements ICreateMentorAvailabiltyUseCase {
    constructor(
        @inject('IMentorAvailabilityRepository') private readonly _mentorAvailablityRepository:IMentorAvailablityRepository
    ){}

    async execute(input: CreateMentorAvailailityDTO): Promise<MentorAvailablityEntity> {
        

        return this._mentorAvailablityRepository.create(
           { ...input,
            isActive:true}
        )
    }
}