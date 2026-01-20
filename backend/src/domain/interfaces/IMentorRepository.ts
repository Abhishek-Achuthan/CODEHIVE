import { UserEntity } from '../entities/UserEntity';
import { PaginationResult } from '../types/PaginationResult';
import { IGenericRepository } from './IGenericRepository';
import { MentorListOptions } from '../types/MentorListOptions';

export interface IMentorRepository extends IGenericRepository<UserEntity>{
    findMentorsExcludeSelf(userId:string,options:MentorListOptions):Promise<PaginationResult<UserEntity>>
}