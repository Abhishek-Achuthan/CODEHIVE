import mongoose from 'mongoose';
import { env } from './envConfig';
import { LoggingService } from '../infrastructure/adapters/logging/LoggingService';


export class MongodbConfig {
    static logger = new LoggingService();
    static async connectDB() {
        try {
            await mongoose.connect(env.mongouri);
            this.logger.info('connected to db');
        } catch (error) {
            if(error instanceof Error) {
                this.logger.error(error.message)
            }
        }
    }
}           