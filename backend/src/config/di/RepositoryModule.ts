import { container } from 'tsyringe';

import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { QuestionRepository } from '../../infrastructure/database/repository/QuestionRepository';
import { IAnswerRepostiory } from '../../domain/interfaces/IAnswerRepository';
import { AnswerRepository } from '../../infrastructure/database/repository/AnswerRepository';
import { ISavedQuestionRepository } from '../../domain/interfaces/ISavedQuestionRepository';
import { SavedQuestionRepository } from '../../infrastructure/database/repository/SavedQuestionRepository';

export class RepositoryModule {
    static registerModules():void {

        //-------------------------------UserRepo--------------------------------------//

        container.register<IUserRepository>('IUserRepository',{
            useClass:UserRepository
        });

        //-------------------------------QuestionRepo----------------------------------//

        container.register<IQuestionRepository>('IQuestionRepository',{
            useClass:QuestionRepository
        });

        //------------------------------AnswerRepo------------------------------------//

        container.register<IAnswerRepostiory>('IAnswerRepository',{
            useClass:AnswerRepository
        });

         //-------------------------Saved Question Repository------------------------//
         
        container.register<ISavedQuestionRepository>('ISavedQuestionRepository',{
            useClass: SavedQuestionRepository
        });
    }
}