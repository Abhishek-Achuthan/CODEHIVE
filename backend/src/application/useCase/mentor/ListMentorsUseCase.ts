import { inject, injectable } from 'tsyringe';
import type { IListMentorsUseCase } from '../interface/mentor/IListMentorsUseCase';
import type { PaginationResult } from '../../../domain/types/PaginationResult';
import type { UserEntity } from '../../../domain/entities/UserEntity';
import { MentorListInputDTO } from '../../dto/SessionDTO';
import { type IMentorRepository } from '../../../domain/interfaces/IMentorRepository';

@injectable()
export class ListMentorsUseCase implements IListMentorsUseCase {
    constructor(
        @inject('IMentorRepository') private readonly _mentorRepository: IMentorRepository
    ) { }

    async execute(input: MentorListInputDTO,userId:string): Promise<PaginationResult<UserEntity>> {
        const { search, page = 1, limit = 10 } = input;

        const data = await this._mentorRepository.findMentorsExcludeSelf(userId,
            {page,limit,
                ...(search && {search})}
        );

        return data

    }
}
