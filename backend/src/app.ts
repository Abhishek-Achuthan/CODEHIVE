import { Express } from "express";
import express from "express";

export class Server {
  private readonly _app: Express;

  constructor() {
    this._app = express();
  }

  public listen() {
    this._app.listen(3000, () => {
      console.log(`server started at port ${3000}`);
    });
  }
}

let app = new Server();
app.listen();

