import {
  UpdateParticipantOverridesDTO,
  UpdateParticipantOverridesResponseDTO,
} from '../../../dto/RoomDTO';

export interface IUpdateParticipantOverridesUseCase {
  execute(data: UpdateParticipantOverridesDTO): Promise<UpdateParticipantOverridesResponseDTO>;
}
