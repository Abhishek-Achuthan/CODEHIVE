import { Server } from '@hocuspocus/server';
import { inject, injectable } from 'tsyringe';

import { env } from '../../config/envConfig';
import {
  CollaborationContext,
  HocuspocusHookHandler,
} from '../../presentation/collaboration/HocuspocusHookHandler';
import { loggerService } from '../../config/di/resolver'; 

@injectable()
export class HocuspocusService {
  private readonly _server: Server;

  constructor(
    @inject(HocuspocusHookHandler)
    private readonly _hookHandler: HocuspocusHookHandler,
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
}
