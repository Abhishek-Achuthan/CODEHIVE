import { IUserLoginResponseDTO } from '../../../dto/UserDTO';

export interface IGithubLoginUseCase {
    execute(code:string) : Promise<IUserLoginResponseDTO>
}