import { injectable } from "tsyringe";
import type { IUserLoginUseCase } from "../../../domain/interfaces/useCases/auth/ILoginUseCase";
import type { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import type { IJWTservice } from "../../services/IJWTservice";
import type { IHashService } from "../../services/IHashservice";

import type { ILoginInputDTO } from "../../../domain/interfaces/DTO/auth/ILoginInputDTO";
import type { ILoginResponceDTO } from "../../../domain/interfaces/DTO/auth/ILoginResponseDTO";
import { UnauthorizedError } from "../../../core/exceptions/UnauthorizedError";

@injectable()
export class UserLoginUseCaseImpl implements IUserLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _jwtService: IJWTservice,
    private _hashService: IHashService
  ) {}

  async execute(data: ILoginInputDTO): Promise<ILoginResponceDTO> {
    const user = await this._userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const passwordMatch = await this._hashService.compare(
      data.password,
      user.password
    );

    if (!passwordMatch) {
      throw new UnauthorizedError();
    }

    const token = this._jwtService.createAccessToken({userId:user.id,role:user.is_mentor?"mentor":"user"});

    return {
      accessToken: token,
      refreshToken: token,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        is_mentor: user.is_mentor,
        is_admin: user.is_admin,
        is_blocked: user.is_blocked,
        id:user.id,
        points:user.points,
        slots_used:user.slots_used
      },
    };
  }
}
