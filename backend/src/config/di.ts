import { container } from "tsyringe";
import "reflect-metadata";
import { diTokens } from "../shared/constants/diTokens";

// Domain interface
import { IUserLoginUseCase } from "../domain/interfaces/useCases/auth/ILoginUseCase";
import { IUserRepository } from "../domain/interfaces/repository/user/IUserRepository";
import { IHashService } from "../application/services/IHashservice";
import { IJWTservice } from "../application/services/IJWTservice";
import { IRegisterUserUseCase } from "../domain/interfaces/useCases/auth/IRegisterUserUseCase";

// Infrastructure Implementations

import { UserRepositoryImpl } from "../infrastructure/database/mongoDB/repositories/userRepositoryImpl";
import { HashServiceImpl } from "../infrastructure/services/HashServiceImpl";
import { JWTServiceImpl } from "../infrastructure/services/JWTServiceImpl";

// Application Use Cases

import { UserLoginUseCaseImpl } from "../application/useCase/auth/UserLogin";
import { RegisterUserUseCaseImpl } from "../application/useCase/auth/RegisterUser";


//Register Service 

container.register<IUserRepository>(diTokens.IUserRepository,{
    useClass : UserRepositoryImpl,
});

container.register<IHashService>(diTokens.IHashService,{
    useClass:HashServiceImpl,
});

container.register<IJWTservice>(diTokens.IJWTService,{
    useClass : JWTServiceImpl,
});


container.register<IUserLoginUseCase>(diTokens.IUserLoginUseCase, {
  useFactory: (c) =>
    new UserLoginUseCaseImpl(
      c.resolve(diTokens.IUserRepository),
      c.resolve(diTokens.IJWTService),
      c.resolve(diTokens.IHashService)
    ),
});

container.register<IRegisterUserUseCase>(diTokens.IRegisterUserUseCase, {
  useFactory: (c) =>
    new RegisterUserUseCaseImpl(
      c.resolve(diTokens.IUserRepository),
      c.resolve(diTokens.IHashService),
    ),
})

export { container }
