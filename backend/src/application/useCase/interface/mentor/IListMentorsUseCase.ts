import { UserEntity } from '../../../../domain/entities/UserEntity';
import { PaginationResult } from '../../../../domain/types/PaginationResult';
import { MentorListInputDTO } from '../../../dto/SessionDTO';

export interface IListMentorsUseCase {
    execute(input: MentorListInputDTO,userId:string): Promise<PaginationResult<UserEntity>>;
}
