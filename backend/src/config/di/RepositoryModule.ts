import { container } from 'tsyringe';

import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { QuestionRepository } from '../../infrastructure/database/repository/QuestionRepository';

export class RepositoryModule {
    static registerModules():void {

        //-------------------------------UserRepo----------------------------------//

        container.register<IUserRepository>('IUserRepository',{
            useClass:UserRepository
        });

        //-------------------------------QuestionRepo----------------------------------//

        container.register<IQuestionRepository>('IQuestionRepository',{
            useClass:QuestionRepository
        });

    }
}