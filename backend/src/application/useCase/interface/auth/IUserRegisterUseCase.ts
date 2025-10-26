import { IUserRegisterInputDTO } from "../../../dto/UserDTO";

export interface IUserRegisterUseCase {
  execute(data: IUserRegisterInputDTO): Promise<void>;
}
