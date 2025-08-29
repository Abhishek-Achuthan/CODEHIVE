import { inject, injectable } from "tsyringe";
import type { IRegisterUserUseCase } from "../../../domain/interfaces/useCases/auth/IRegisterUserUseCase";
import type { IHashService } from "../../services/IHashservice";
import type { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import type { IRegisterUserInputDTO } from "../../../domain/interfaces/DTO/auth/IRegisterUserInputDTO";
import type { IRegisterUserResponseDTO } from "../../../domain/interfaces/DTO/auth/IRegisterUserResponseDTO";
import { EmailAlreadyInUseError } from "../../../core/exceptions/EmailAlreadyInUseError";
import { UserCreationError } from "../../../core/exceptions/UserCreationError";

@injectable()
export class RegisterUserUseCaseImpl implements IRegisterUserUseCase {

  constructor(
    @inject ("UserRepository") private _userRepository: IUserRepository,
    @inject ("HashService") private _hashService:IHashService
  ) {}

  async execute(data: IRegisterUserInputDTO): Promise<IRegisterUserResponseDTO> {
      const user = await this._userRepository.findByEmail(data.email);

      if(user){
        throw new EmailAlreadyInUseError();
      }   

      const hashedUser = {...data,password:await this._hashService.hash(data.password)};
      const newUser = await this._userRepository.createUser(hashedUser);

      if(!newUser){
        throw new UserCreationError();
      }
      
      return {
        success:true
      };
  }

}
