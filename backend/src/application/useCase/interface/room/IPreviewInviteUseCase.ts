import { InvitePreviewResponseDTO } from '../../../dto/RoomDTO';

export interface IPreviewInviteUseCase {
  execute(inviteCode: string, userId?: string): Promise<InvitePreviewResponseDTO>;
}
