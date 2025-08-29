import { container } from "tsyringe";
import "reflect-metadata";
import { diTokens } from "../shared/constants/diTokens";

// Domain interface
import { IUserLoginUseCase } from "../application/useCases/auth/ILoginUseCase";
import { IUserRepository } from "../domain/interfaces/repository/user/IUserRepository";
import { IHashService } from "../application/ports/IHashservice";
import { IJWTservice } from "../application/ports/IJWTservice";
import { IRegisterUserUseCase } from "../application/useCases/auth/IRegisterUserUseCase";
import { ILoggerService } from "../application/ports/Logging/ILoggerService";

// Infrastructure Implementations

import { UserRepositoryImpl } from "../infrastructure/database/mongoDB/repositories/userRepositoryImpl";
import { HashServiceImpl } from "../infrastructure/adapters/HashServiceImpl";
import { JWTServiceImpl } from "../infrastructure/adapters/JWTServiceImpl";
import { LoggingServiceImpl } from "../infrastructure/adapters/Logging/LoggingServiceImpl";
// Application Use Cases

import { UserLoginUseCaseImpl } from "../application/useCase/auth/UserLogin";
import { RegisterUserUseCaseImpl } from "../application/useCase/auth/RegisterUser";

//Register Service

container.register<IUserRepository>(diTokens.IUserRepository, {
  useClass: UserRepositoryImpl,
});

container.register<IHashService>(diTokens.IHashService, {
  useClass: HashServiceImpl,
});

container.register<IJWTservice>(diTokens.IJWTService, {
  useClass: JWTServiceImpl,
});

container.register<ILoggerService>(diTokens.ILoggerService, {
  useClass: LoggingServiceImpl,
});

container.register<IUserLoginUseCase>(diTokens.IUserLoginUseCase, {
  useClass: UserLoginUseCaseImpl,
});

container.register<IRegisterUserUseCase>(diTokens.IRegisterUserUseCase, {
  useClass: RegisterUserUseCaseImpl,
});

export { container };
