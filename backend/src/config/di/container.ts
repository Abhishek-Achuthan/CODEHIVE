import { ServiceModule } from "./ServiceModule";
import { RepositoryModule } from "./RepositoryModule";

export class ContainerSetup {
    static registerAll(): void {
        ServiceModule.registerModules();
        RepositoryModule.registerModules();
    }
}