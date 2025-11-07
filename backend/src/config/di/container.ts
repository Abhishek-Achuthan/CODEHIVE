import { ServiceModule } from './ServiceModule';
import { RepositoryModule } from './RepositoryModule';
import { UseCaseModule } from './UseCaseModule';

export class ContainerSetup {
    static registerAll(): void {
        ServiceModule.registerModules();
        RepositoryModule.registerModules();
        UseCaseModule.registerModules();
    }
}