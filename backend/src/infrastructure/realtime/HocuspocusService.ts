import { Server } from '@hocuspocus/server';
import { inject, injectable } from 'tsyringe';

import { env } from '../../config/envConfig';
import {
  CollaborationContext,
  HocuspocusHookHandler,
} from '../../presentation/collaboration/HocuspocusHookHandler';
import { loggerService } from '../../config/di/resolver';
import { RoomAuthorizationService } from '../../application/services/RoomAuthorizationService';

@injectable()
export class HocuspocusService {
  private readonly _server: Server;

  constructor(
    @inject(HocuspocusHookHandler)
    private readonly _hookHandler: HocuspocusHookHandler,
    @inject(RoomAuthorizationService)
    private readonly _roomAuthorizationService: RoomAuthorizationService,
  ) {
    this._server = new Server<CollaborationContext>({
      port: env.hocuspocusPort,
      onAuthenticate: async (data) => this._hookHandler.onAuthenticate(data),
      onConnect: async (data) => this._hookHandler.onConnect(data),
      onLoadDocument: async (data) => this._hookHandler.onLoadDocument(data),
      onChange: async (data) => this._hookHandler.onChange(data),
      beforeSync: async (data) => this._hookHandler.beforeSync(data),
      onDisconnect: async (data) => this._hookHandler.onDisconnect(data),
    });
  }

  listen(): void {
    this._server.listen();
    loggerService.info(`Hocuspocus running on ws://localhost:${env.hocuspocusPort}`);
  }

  /**
   * Updates readOnly on active Hocuspocus connections after participant overrides change.
   */
  async syncCollaborationWriteAccess(roomId: string, userId: string): Promise<void> {
    const documentNames = [
      `room-${roomId}-whiteboard`,
      `room-${roomId}-public-note`,
    ];

    for (const documentName of documentNames) {
      const document = this._server.hocuspocus.documents.get(documentName);
      if (!document) continue;

      const canWrite = await this._roomAuthorizationService.isCollaborationWriteAllowed(
        userId,
        documentName,
      );
      const readOnly = !canWrite;

      for (const connection of document.getConnections()) {
        const contextUserId = (connection.context as CollaborationContext | undefined)?.user
          ?.userId;
        if (contextUserId === userId) {
          connection.readOnly = readOnly;
        }
      }
    }
  }
}
