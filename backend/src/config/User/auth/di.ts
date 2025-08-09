import { container } from "tsyringe";
import "reflect-metadata";
import { diTokens } from "../../../shared/constants/diTokens";

// Domain interface
import { IUserLoginUseCase } from "../../../domain/interfaces/useCases/user/auth/ILoginUseCase";
import { IUserRepository } from "../../../domain/interfaces/repository/user/userRepository";
import { IHashService } from "../../../application/services/IHashservice";
import { IJWTservice } from "../../../application/services/IJWTservice";

// Infrastructure Implementations

import { UserRepositoryImpl } from "../../../infrastructure/database/mongoDB/repositories/userRepositoryImpl";
import { HashServiceImpl } from "../../../infrastructure/services/HashServiceImpl";
import { JWTServiceImpl } from "../../../infrastructure/services/JWTServiceImpl";

// Application Use Cases

import { UserLoginUseCaseImpl } from "../../../application/useCase/auth/UserLogin";


//Register Service 

container.register<IUserRepository>(diTokens.IUserRepository,{
    useClass : UserRepositoryImpl,
});

container.register<IHashService>(diTokens.IHashService,{
    useClass:HashServiceImpl,
})

container.register<IJWTservice>(diTokens.IJWTService,{
    useClass : JWTServiceImpl,
});

container.register<IUserLoginUseCase>(diTokens.IUserLoginUseCase,{
    useClass: UserLoginUseCaseImpl,
});

export { container }
