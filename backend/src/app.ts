import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Express } from "express";
dotenv.config();
import { AuthRoute } from "./presentation/routes/AuthRoutes";
import { MongodbConfig } from './config/MongodbConfig';
import { env } from './config/envConfig';
import cors from 'cors'

export class App {
  private readonly _app: Express;

  constructor() {
    this._app = express();
    this.configMiddlewares();
    this.configRoutes();
    this.configDb();
  }

  configDb () {
    MongodbConfig.connectDB();
  }

  configMiddlewares() {
    this._app.use(
      cors({
        origin: env.frontendUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );
    this._app.use(express.urlencoded());
    this._app.use(express.json());
  }

  configRoutes() {
    const authRoute = new AuthRoute();
    this._app.use('/api/auth',authRoute.getRoutes());
  }

  public listen() {
    this._app.listen(env.port, () => {
      console.log(`server started at port ${env.port}`);
    });
  }
}

const app = new App();
app.listen();
