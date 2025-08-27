import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { loginSchema } from "../../validators/auth/LoginValidator";
import { diTokens } from "../../../shared/constants/diTokens";
import type { IUserLoginUseCase } from "../../../domain/interfaces/useCases/auth/ILoginUseCase";
import type { IRegisterUserUseCase } from "../../../domain/interfaces/useCases/auth/IRegisterUserUseCase";
import { ILoginInputDTO } from "../../../domain/interfaces/DTO/auth/ILoginInputDTO";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { IRegisterUserInputDTO } from "../../../domain/interfaces/DTO/auth/IRegisterUserInputDTO";
import { RegisterSchema } from "../../validators/auth/RegisterValidator";

@injectable()
export class AuthController {
  constructor(
    @inject(diTokens.IUserLoginUseCase) private loginUseCase: IUserLoginUseCase,
    @inject(diTokens.IRegisterUserUseCase) private registerUseCase:IRegisterUserUseCase,
    
  ) {}


  async registerUser(req:Request,res:Response):Promise<void>{
    try {
      const parsed = RegisterSchema.safeParse(req.body);
      
      if(!parsed.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({errors:parsed.error});
          return;
      }

      const dto: IRegisterUserInputDTO = {
        email:parsed.data.email,
        password:parsed.data.password,
        phone:parsed.data.phone,
        first_name:parsed.data.first_name,
        last_name:parsed.data.last_name
      };

      const result = await this.registerUseCase.execute(dto);
      res.status(HttpStatus.OK).json(result);
    }catch(err:any){
      res
      .status(HttpStatus.FORBIDDEN)
      .json({ error: err.message || "Register failed" });

    }
  }
  
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
  
      if (!parsed.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ errors: parsed.error });
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
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err.message || "Login failed" });
    }
  }
}
