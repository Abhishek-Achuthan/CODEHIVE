import { MentorAvailablityEntity } from '../session/MentorAvailablityEntity';
import { IGenericRepository } from './IGenericRepository';

export interface IMentorAvailablityRepository extends IGenericRepository<MentorAvailablityEntity> {
    findByMentor(mentorId:string):Promise<MentorAvailablityEntity[]>
    deactivate(id:string):Promise<MentorAvailablityEntity | null>
}