import { UserEntity } from "../../../../domain/entities/UserEntity";

export interface IGithubLoginUseCase {
    execute(code:string) : Promise<{user:UserEntity,accessToken:string,refreshToken:string}>
}