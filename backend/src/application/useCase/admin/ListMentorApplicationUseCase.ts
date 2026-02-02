import { inject, injectable } from "tsyringe";
import { IListMentorApplicationUseCase } from "../interface/admin/IListMentorApplicationUseCase";
import { type IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { PaginationResult } from "../../../domain/types/PaginationResult";
import { IMentorApplicationListResponseDTO } from "../../dto/AdminDTO";



@injectable()
export class ListMentorApplicationUseCase implements IListMentorApplicationUseCase {
    constructor(
        @inject('IUserRepository')
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(currentPage?: number, pageSize?: number, search?: string): Promise<PaginationResult<IMentorApplicationListResponseDTO>> {

        const mentorApplications = await this._userRepository.findMentorApplications(currentPage, pageSize, search);

        const items = mentorApplications.items
            .map((item) => {
                return {
                    id: item.id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    mentorStatus: item.mentorStatus,
                    mentorAppliedAt: item.mentorAppliedAt!,
                }
            })

        return { items, totalPages: mentorApplications.totalPages, totalItems: mentorApplications.totalItems }
    }
}