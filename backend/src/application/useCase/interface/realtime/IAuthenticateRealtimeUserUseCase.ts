import {
  AuthenticateRealtimeUserDTO,
  RealtimeUserContextDTO,
} from '../../../dto/CollaborationDTO';

export interface IAuthenticateRealtimeUserUseCase {
  execute(data: AuthenticateRealtimeUserDTO): Promise<RealtimeUserContextDTO>;
}
