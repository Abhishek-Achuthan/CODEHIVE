import { inject, injectable } from 'tsyringe';
import type { IListMentorsUseCase } from '../interface/mentor/IListMentorsUseCase';
import type { PaginationResult } from '../../../domain/types/PaginationResult';
import type { UserEntity } from '../../../domain/entities/UserEntity';
import { MentorListInputDTO } from '../../dto/SessionDTO';
import { type IMentorRepository } from '../../../domain/interfaces/IMentorRepository';
import type { IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';

@injectable()
export class ListMentorsUseCase implements IListMentorsUseCase {
    constructor(
        @inject('IMentorRepository') private readonly _mentorRepository: IMentorRepository,
        @inject('IMentorAvailabilityRepository') private readonly _mentorAvailabilityRepository: IMentorAvailabilityRepository
    ) { }

    async execute(input: MentorListInputDTO,userId:string): Promise<PaginationResult<UserEntity>> {
        const { search, page = 1, limit = 10, filter } = input;

        const hasAvailabilityFilters =
            filter?.hasActiveAvailability === true ||
            filter?.slotPriceMin !== undefined ||
            filter?.slotPriceMax !== undefined;

        let mentorIds: string[] | undefined;

        if (hasAvailabilityFilters) {
            mentorIds = await this._mentorAvailabilityRepository.findMentorIdsByFilters({
                ...(filter?.hasActiveAvailability !== undefined && { hasActiveAvailability: filter.hasActiveAvailability }),
                ...(filter?.slotPriceMin !== undefined && { slotPriceMin: filter.slotPriceMin }),
                ...(filter?.slotPriceMax !== undefined && { slotPriceMax: filter.slotPriceMax }),
            });
        }

        const data = await this._mentorRepository.findMentorsExcludeSelf(userId,
            {
                page,
                limit,
                ...(search && {search}),
                filter: {
                    ...(filter?.primaryExpertise !== undefined && { primaryExpertise: filter.primaryExpertise }),
                    ...(filter?.experienceLevel !== undefined && { experienceLevel: filter.experienceLevel }),
                    ...(filter?.skillsAny !== undefined && { skillsAny: filter.skillsAny }),
                    ...(mentorIds !== undefined && { mentorIds }),
                },
            }
        );

        return data

    }
}
