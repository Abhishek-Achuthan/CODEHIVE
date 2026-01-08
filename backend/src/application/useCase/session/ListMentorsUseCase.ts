import { inject, injectable } from 'tsyringe';
import type { IListMentorsUseCase } from '../interface/session/IListMentorsUseCase';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserRole } from '../../../domain/types/UserRole';
import type { PaginationResult } from '../../../domain/types/PaginationResult';
import type { UserEntity } from '../../../domain/entities/UserEntity';
import { MentorListinputDTO } from '../../dto/SessionDTO';

@injectable()
export class ListMentorsUseCase implements IListMentorsUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository
    ) { }

    async execute(input: MentorListinputDTO): Promise<PaginationResult<UserEntity>> {
        const { search, page = 1, limit = 10 } = input;
        return await this._userRepository.getAllUsers(
            UserRole.MENTOR,
            page,
            limit,
            undefined, 
            search
        );
    }
}
