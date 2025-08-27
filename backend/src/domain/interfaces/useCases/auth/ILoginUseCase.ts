import { ILoginInputDTO } from "../../DTO/auth/ILoginInputDTO";
import { ILoginResponceDTO } from "../../DTO/auth/ILoginResponseDTO";

export interface IUserLoginUseCase {
    execute(data:ILoginInputDTO):Promise<ILoginResponceDTO>
}