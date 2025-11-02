import {
  IUserLoginInputDTO,
  IUserLoginResponseDTO,
} from "../../../dto/UserDTO";

export interface IUserLoginUseCase {
  execute(data: IUserLoginInputDTO): Promise<IUserLoginResponseDTO>;
}
