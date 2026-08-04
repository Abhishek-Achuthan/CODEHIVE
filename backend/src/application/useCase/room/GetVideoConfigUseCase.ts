import { inject, injectable } from 'tsyringe';
import { IGetVideoConfigUseCase } from '../interface/room/IGetVideoConfigUseCase';
import { VideoConfigResponseDTO } from '../../dto/VideoConfigDTO';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { env } from '../../../config/envConfig';
import * as jwt from 'jsonwebtoken';

@injectable()
export class GetVideoConfigUseCase implements IGetVideoConfigUseCase {
  constructor(
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(roomId: string, userId: string): Promise<VideoConfigResponseDTO> {
    await this._roomAuthorizationService.assertParticipant(roomId, userId, 'read');

    const user = await this._userRepository.find(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const appId = env.jitsiAppId;
    const kid = env.jitsiApiKey;
    const privateKey = env.jitsiPrivateKey;
    
    // Format private key properly in case it's one line
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const roomName = `codehive-room-${roomId}`;
    const displayName = `${user.firstName} ${user.lastName}`.trim();

    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        aud: 'jitsi',
        iss: 'chat',
        iat: now,
        exp: now + 7200, // 2 hours
        sub: appId,
        room: roomName,
        context: {
          features: {
            recording: false,
            livestreaming: false,
            transcription: false,
            'outbound-call': false,
          },
          user: {
            id: user.id,
            name: displayName,
            email: user.email,
            avatar: user.avatarUrl || '',
            moderator: true, 
          },
        },
      },
      formattedPrivateKey,
      {
        algorithm: 'RS256',
        header: {
          alg: 'RS256',
          kid: kid,
          typ: 'JWT',
        },
      }
    );

    return {
      appId,
      roomName,
      jwt: token,
      displayName,
    };
  }
}
