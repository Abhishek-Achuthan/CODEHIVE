import { PaginationResult } from "../../../../domain/types/PaginationResult";
import { IMentorApplicationListResponseDTO } from "../../../dto/AdminDTO";

export interface IListMentorApplicationUseCase {
    execute(
        currentPage?:number,
        pageSize?:number,
        search?:string
    ):Promise<PaginationResult<IMentorApplicationListResponseDTO>>
}