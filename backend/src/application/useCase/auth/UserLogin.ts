import { inject, injectable } from "tsyringe";
import type { IUserLoginUseCase } from "../../../domain/interfaces/useCases/user/auth/ILoginUseCase";
import type { IUserRepository } from "../../../domain/interfaces/repository/user/userRepository";
import type { IJWTservice } from "../../services/IJWTservice";
import type { IHashService } from "../../services/IHashservice";

import type { ILoginInputDTO } from "../../DTO/auth/user/ILoginInputDTO";
import type { ILoginResponceDTO } from "../../DTO/auth/user/ILoginResponceDTO";
import { UnauthorizedError } from "../../../core/exeptions/UnauthorizedError";

@injectable()
export class UserLoginUseCaseImpl implements IUserLoginUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("JWTservice") private jwtService: IJWTservice,
    @inject("HashService") private hashService: IHashService
  ) {}

  async execute(data: ILoginInputDTO): Promise<ILoginResponceDTO> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const passwordMatch = await this.hashService.compare(
      data.password,
      user.password
    );

    if (!passwordMatch) {
      throw new UnauthorizedError();
    }

    const token = this.jwtService.createAccessToken({userId:user.id,role:user.first_name});

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
