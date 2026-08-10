import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

import { initInfisical } from '../config/infisicalConfig';
import { MongodbConfig } from '../config/MongodbConfig';
import { hocuspocusService } from '../config/di/resolver';

export class CollaborationApp {
  private async configDb(): Promise<void> {
    await MongodbConfig.connectDB();
  }

  public async listen(): Promise<void> {
    await initInfisical();
    await this.configDb();
    hocuspocusService.listen();
  }
}

const collaborationApp = new CollaborationApp();
collaborationApp.listen();
