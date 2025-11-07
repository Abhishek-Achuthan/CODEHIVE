import { container } from 'tsyringe';

import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository';

export class RepositoryModule {
    static registerModules():void {
        container.register<IUserRepository>('IUserRepository',{
            useClass:UserRepository
        });
    }
}