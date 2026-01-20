import { UserEntity } from '../../../../domain/entities/UserEntity';
import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { MentorListinputDTO } from '../../../dto/SessionDTO';

export interface IListMentorsUseCase {
    execute(input: MentorListinputDTO,userId:string): Promise<PaginationResult<UserEntity>>;
}
