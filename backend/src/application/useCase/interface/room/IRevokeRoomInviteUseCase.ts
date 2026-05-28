export interface IRevokeRoomInviteUseCase {
  execute(roomId: string, inviteId: string, hostUserId: string): Promise<void>;
}
