import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { AuthRoute } from './presentation/routes/AuthRoutes';
import { AdminRoute } from './presentation/routes/AdminRoutes';
import { MongodbConfig } from './config/MongodbConfig';
import { env } from './config/envConfig';
import cors from 'cors';
import { errorHandler } from './presentation/middlewares/errorHanlder';
import cookieParser from 'cookie-parser';
import { QnARoutes } from './presentation/routes/QnARoutes';
import { UserRoute } from './presentation/routes/UserRoutes';
import { SessionRoutes } from './presentation/routes/SessionRoutes';
import { MentorRoutes } from './presentation/routes/MentorRoutes';
import { WebhooksRoutes } from './presentation/routes/WebhooksRoutes';
import { WalletRoutes } from './presentation/routes/WalletRoutes';
import { socketService } from './config/di/resolver';

export class App {
  private readonly _app: Express;
  private readonly _httpServer: HttpServer;
  private readonly _io: SocketIOServer;

  constructor() {
    this._app = express();
    this._httpServer = createServer(this._app);
    this._io = new SocketIOServer(this._httpServer, {
      cors: {
        origin: env.frontendUrl,
        credentials: true,
      },
    });
    this.configMiddlewares();
    this.configRoutes();
    this.configDb();
    this.configSocket();
    this.configErrorHanldingMiddleWares();
  }

  private configDb() {
    MongodbConfig.connectDB();
  }

  private configMiddlewares() {
    this._app.use(
      cors({
        origin: env.frontendUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    );
    this._app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser());
  }

  private configRoutes() {
    const authRoute = new AuthRoute();
    const adminRoute = new AdminRoute();
    const qnaRoutes = new QnARoutes;
    const userRoute = new UserRoute;
    const sessionRoutes = new SessionRoutes();
    const mentorRoutes = new MentorRoutes();
    const webhookRoutes = new WebhooksRoutes;
    const walletRoutes = new WalletRoutes();
    this._app.use('/api/auth', authRoute.getRoutes());
    this._app.use('/api/admin', adminRoute.getRoutes());
    this._app.use('/api/qna', qnaRoutes.getRoutes());
    this._app.use('/api/users', userRoute.getRoutes());
    this._app.use('/api/sessions', sessionRoutes.getRoutes());
    this._app.use('/api/mentors', mentorRoutes.getRoutes());
    this._app.use('/api/webhook', webhookRoutes.getRoutes());
    this._app.use('/api/wallet', walletRoutes.getRoutes());
  }

  private configErrorHanldingMiddleWares() {
    this._app.use(errorHandler);
  }

  private configSocket() {
    socketService.initialize(this._io);
  }

  public listen() {
    this._httpServer.listen(env.port, () => {
      console.log(`server started at port ${env.port}`);
    });
  }
}

const app = new App();
app.listen();
