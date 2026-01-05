import { MentorAvailablityEntity } from '../../../../domain/session/MentorAvailablityEntity';
import { CreateMentorAvailailityDTO } from '../../../dto/SessionDTO';

export interface ICreateMentorAvailabiltyUseCase {
    execute(input:CreateMentorAvailailityDTO):Promise<MentorAvailablityEntity>;
}