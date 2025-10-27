import mongoose from "mongoose";
import { env } from "./envConfig";


export class MongodbConfig {
    static async connectDB() {
        try {
            await mongoose.connect(env.mongouri);
            console.log('connected to db');
        } catch (error) {
            console.log('Something went wrong',error);
        }
    }
}