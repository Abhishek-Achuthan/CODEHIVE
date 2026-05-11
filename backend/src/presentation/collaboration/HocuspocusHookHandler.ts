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
  }

  async onConnect(_data: onConnectPayload<CollaborationContext>): Promise<void> {}

  async onLoadDocument(
    _data: onLoadDocumentPayload<CollaborationContext>
  ): Promise<void> {}

  async beforeSync(_data: beforeSyncPayload<CollaborationContext>): Promise<void> {}

  async onChange(_data: onChangePayload<CollaborationContext>): Promise<void> {}

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
