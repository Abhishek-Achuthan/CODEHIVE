import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

import { MongodbConfig } from '../config/MongodbConfig';
import { hocuspocusService } from '../config/di/resolver';

export class CollaborationApp {
  private configDb(): void {
    MongodbConfig.connectDB();
  }

  public listen(): void {
    this.configDb();
    hocuspocusService.listen();
  }
}

const collaborationApp = new CollaborationApp();
collaborationApp.listen();
