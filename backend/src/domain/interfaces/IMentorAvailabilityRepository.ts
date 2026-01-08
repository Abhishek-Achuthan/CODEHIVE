import { MentorAvailabilityEntity } from '../session/MentorAvailabilityEntity';
import { IGenericRepository } from './IGenericRepository';

export interface IMentorAvailabilityRepository extends IGenericRepository<MentorAvailabilityEntity> {
    findByMentor(mentorId:string):Promise<MentorAvailabilityEntity[]>
    deactivate(id:string):Promise<MentorAvailabilityEntity | null>
}