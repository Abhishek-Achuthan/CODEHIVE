import { AvailableSlotDTO } from '../../../dto/SessionDTO';

export interface IGetAvailableSlotsUseCase {
    execute(mentorId:string,date:string):Promise<AvailableSlotDTO[]>
}