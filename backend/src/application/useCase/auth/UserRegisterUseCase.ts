import { inject, injectable } from "tsyringe";
import { IUserRegisterUseCase } from "../interface/auth/IUserRegisterUseCase";
import type { IHashService } from "../../ports/security/IHashService";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IUserRegisterInputDTO } from "../../dto/UserDTO";
import { ConflictError } from "../../../core/errors/ConflictError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";

@injectable()
export class UserRegisterUseCase implements IUserRegisterUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IHashService") 
    private readonly _hashService: IHashService
  ) {}

  async execute(data: IUserRegisterInputDTO): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(data.email);

    if (existingUser) throw new ConflictError(ERROR_MESSAGES.USER.ALREADY_EXIST);

    const hashedPassword = await this._hashService.hash(data.password);

    const user = { ...data, password: hashedPassword };

    await this._userRepository.create(user);
  }
}
