import { IUserLoginResponseDTO } from '../../../dto/UserDTO';

export interface IGoogleLoginUseCase {
    execute(idToken:string):Promise<IUserLoginResponseDTO>;
}