import { IUserProfileResponseDTO, UpdateUserProfileDTO } from '../../../dto/UserDTO';

export interface IUpdateUserProfileUseCase {
    execute(data:UpdateUserProfileDTO,userId:string):Promise<IUserProfileResponseDTO>
}