import { ICreatePollInputDTO, ICreatePollOutputDTO } from "../../../dto/PollDTO";

export interface ICreatePollUseCase {
    execute(data:ICreatePollInputDTO):Promise<ICreatePollOutputDTO>;
}