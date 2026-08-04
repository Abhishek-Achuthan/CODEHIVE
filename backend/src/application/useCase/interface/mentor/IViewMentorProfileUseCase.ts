import { IMentorProfileResponseDTO } from '../../../dto/SessionDTO';

export interface IViewMentorProfileUseCase {
    execute(id:string):Promise<IMentorProfileResponseDTO>
}