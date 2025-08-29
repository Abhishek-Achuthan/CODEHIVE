import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import "./config/di";
import express from "express";
import { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Auth_routes } from "./presentation/routes/user/AuthRoute";
import { MongodbConnect } from "./config/mongodbConfig";
import { requestLoggerMiddleware,errorLoggerMiddleware } from "./infrastructure/middlewares/loggingMIddleware";

class Server {
  private _app: Express;

  constructor() {
    this._app = express();
    MongodbConnect.connect();
    this._setMiddlewares();
    this._setAuthRouter();
    this._setErrorMiddlewares();
  }

  public listen() {
    const PORT = process.env.PORT ?? 3111;
    this._app.listen(PORT, (err) => {
      if (err) {
        console.log("Error while starting server");
        throw err;
      }
      console.log(`Server running successfully on ${PORT}`);
    });
  }

  private _setMiddlewares() {
    this._app.use(cors());
    this._app.use(express.json());
    this._app.use(cookieParser());
    this._app.use(requestLoggerMiddleware);
  }

  private _setAuthRouter() {
    this._app.use("/api/v1/user/auth/", new Auth_routes().getRoute());
  }

  private _setErrorMiddlewares() {
    this._app.use(errorLoggerMiddleware);
  }
}

const server = new Server();
server.listen();
