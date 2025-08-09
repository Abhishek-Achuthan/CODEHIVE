import { ILoginInputDTO } from "../../../../../application/DTO/auth/user/ILoginInputDTO";
import { ILoginResponceDTO } from "../../../../../application/DTO/auth/user/ILoginResponceDTO";

export interface IUserLoginUseCase {
    execute(data:ILoginInputDTO):Promise<ILoginResponceDTO>
}