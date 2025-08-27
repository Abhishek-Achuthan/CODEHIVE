import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import "./config/di";
import express from "express";
import { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Auth_routes} from "./presentation/routes/user/AuthRoute";
import { MongoDbConnect } from "./infrastructure/config/mongodbConfig";

class Server {
    private app: Express;
  constructor() {
    MongoDbConnect.connect();
    this.app = express();
    this.setMiddlewares();
    this.setAuthRouter();
  }

  public listen() {
    const PORT = process.env.PORT ?? 3111;
    this.app.listen(PORT, (err) => {
      if (err) {
        console.log("Error while starting server");
        throw err;
      }
      console.log(`Server running successfully on ${PORT}`);
    });
  }

  private setMiddlewares(){
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private setAuthRouter(){
    this.app.use("/api/v1/user/auth/",new Auth_routes().getRoute());
  }
}

const server = new Server();
server.listen();
