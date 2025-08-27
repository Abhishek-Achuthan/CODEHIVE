import { IRegisterUserInputDTO} from "../../DTO/auth/IRegisterUserInputDTO"
import { IRegisterUserResponseDTO } from "../../DTO/auth/IRegisterUserResponseDTO";

export interface IRegisterUserUseCase{
    execute(data:IRegisterUserInputDTO):Promise<IRegisterUserResponseDTO>
}