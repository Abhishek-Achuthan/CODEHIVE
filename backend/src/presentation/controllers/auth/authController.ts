import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import type { IUserLoginUseCase } from "../../../domain/interfaces/useCases/user/auth/ILoginUseCase";
import { loginSchema } from "../../validators/auth/LoginValidator";
import { diTokens } from "../../../shared/constants/diTokens";
import { ILoginInputDTO } from "../../../application/DTO/auth/user/ILoginInputDTO";
import { HttpStatus } from "../../../shared/constants/httpStatus";

@injectable()
export class AuthController {
  constructor(
    @inject(diTokens.IUserLoginUseCase)
    private loginUseCase: IUserLoginUseCase
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ errors: parsed.error.format() });
        return;
      }

      const dto: ILoginInputDTO = {
        email: parsed.data.email,
        password: parsed.data.password,
      };

      const result = await this.loginUseCase.execute(dto);

      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ error: err.message || "Login failed" });
    }
  }
}
