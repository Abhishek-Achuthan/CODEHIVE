import {
  onAuthenticatePayload,
  beforeSyncPayload,
  onChangePayload,
  onConnectPayload,
  onDisconnectPayload,
  onLoadDocumentPayload,
} from '@hocuspocus/server';
import { inject, injectable } from 'tsyringe';

import type { IAuthenticateRealtimeUserUseCase } from '../../application/useCase/interface/realtime/IAuthenticateRealtimeUserUseCase';
import type { IAuthorizeCollaborationAccessUseCase } from '../../application/useCase/interface/realtime/IAuthorizeCollaborationAccessUseCase';
import { RealtimeUserContextDTO } from '../../application/dto/CollaborationDTO';
import { RoomAuthorizationService } from '../../application/services/RoomAuthorizationService';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export interface CollaborationContext {
  user?: RealtimeUserContextDTO;
}

@injectable()
export class HocuspocusHookHandler {
  constructor(
    @inject('IAuthenticateRealtimeUserUseCase')
    private readonly _authenticateRealtimeUserUseCase: IAuthenticateRealtimeUserUseCase,
    @inject('IAuthorizeCollaborationAccessUseCase')
    private readonly _authorizeCollaborationAccessUseCase: IAuthorizeCollaborationAccessUseCase,
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {}

  async onAuthenticate(
    data: onAuthenticatePayload<CollaborationContext>
  ): Promise<void> {
    const token = this.extractToken(data);
    const user = await this._authenticateRealtimeUserUseCase.execute({ token });

    await this._authorizeCollaborationAccessUseCase.execute({
      userId: user.userId,
      documentName: data.documentName,
    });

    data.context.user = user;

    // Hocuspocus applies Yjs updates before onChange runs. Enforce write access
    // at connection time via readOnly so unauthorized edits are rejected at the
    // protocol layer without throwing (which would crash the process).
    const canWrite = await this._roomAuthorizationService.isCollaborationWriteAllowed(
      user.userId,
      data.documentName,
    );
    data.connectionConfig.readOnly = !canWrite;
  }

  async onConnect(_data: onConnectPayload<CollaborationContext>): Promise<void> {}

  async onLoadDocument(
    _data: onLoadDocumentPayload<CollaborationContext>
  ): Promise<void> {}

  async beforeSync(_data: beforeSyncPayload<CollaborationContext>): Promise<void> {}

  async onChange(_data: onChangePayload<CollaborationContext>): Promise<void> {
    // Write authorization is enforced via connection readOnly set in onAuthenticate.
    // onChange runs after the document has already been updated; throwing here
    // produces an unhandled rejection and can terminate the Node process.
  }

  async onDisconnect(
    _data: onDisconnectPayload<CollaborationContext>
  ): Promise<void> {}

  private extractToken(
    data: onAuthenticatePayload<CollaborationContext>
  ): string {
    const authorizationHeader = data.requestHeaders.get('authorization');

    if (authorizationHeader?.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];

      if (token) {
        return token;
      }
    }

    if (data.token) {
      return data.token;
    }

    const queryToken = data.requestParameters.get('token');

    if (queryToken) {
      return queryToken;
    }

    throw new Error(ERROR_MESSAGES.AUTH.INVALID_TOKEN);
  }
}
