import { UserEntity } from "../../../../domain/entities/UserEntity";

export interface IGoogleLoginUseCase {
    execute(idToken:string):Promise<{
        user:UserEntity,
        accessToken:string,
        refreshToken:string
    }>
}