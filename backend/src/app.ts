import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { initInfisical } from './config/infisicalConfig';
import express, { Express } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { AuthRoute } from './presentation/routes/AuthRoutes';
import { AdminRoute } from './presentation/routes/AdminRoutes';
import { MongodbConfig } from './config/MongodbConfig';
import { env, logLoadedEnv } from './config/envConfig';

import cors from 'cors';
import { errorHandler } from './presentation/middlewares/errorHanlder';
import cookieParser from 'cookie-parser';
import { QnARoutes } from './presentation/routes/QnARoutes';
import { UserRoute } from './presentation/routes/UserRoutes';
import { SessionRoutes } from './presentation/routes/SessionRoutes';
import { MentorRoutes } from './presentation/routes/MentorRoutes';
import { WebhooksRoutes } from './presentation/routes/WebhooksRoutes';
import { WalletRoutes } from './presentation/routes/WalletRoutes';
import { SubscriptionRoutes } from './presentation/routes/SubscriptionRoutes';
import {
  hocuspocusService,
  socketHandlers,
  socketService,
  stripeRefundRetryService,
  loggerService,
} from './config/di/resolver';
import { initializeRabbitMQConnection } from './config/rabbitMQConfig';
import { RoomRoutes } from './presentation/routes/RoomRoutes';
import { InviteRoutes } from './presentation/routes/InviteRoutes';
import { PlanRoute } from './presentation/routes/PlanRoutes';
import { CodeRoutes } from './presentation/routes/CodeRoutes';
import { NotificationRoute } from './presentation/routes/NotificationRoutes';

export class App {
  private readonly _app: Express;
  private readonly _httpServer: HttpServer;
  private _io!: SocketIOServer;
  private readonly _logger;

  constructor() {
    this._app = express();
    this._httpServer = createServer(this._app);
    this._logger = loggerService;
  }

  private async configDb() {
    await MongodbConfig.connectDB();
  }

  private configMiddlewares() {
    this._app.use(
      cors({
        origin: env.frontendUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );
    this._app.use(
      '/api/webhook/stripe',
      express.raw({ type: 'application/json' }),
    );
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser());
  }

  private configRoutes() {
    const authRoute = new AuthRoute();
    const adminRoute = new AdminRoute();
    const qnaRoutes = new QnARoutes();
    const userRoute = new UserRoute();
    const sessionRoutes = new SessionRoutes();
    const mentorRoutes = new MentorRoutes();
    const webhookRoutes = new WebhooksRoutes();
    const walletRoutes = new WalletRoutes();
    const roomRoutes = new RoomRoutes();
    const inviteRoutes = new InviteRoutes();
    const planRoute = new PlanRoute();
    const subscriptionRoute = new SubscriptionRoutes();
    const codeRoutes = new CodeRoutes();
    const notificationRoute = new NotificationRoute();
    this._app.use('/api/auth', authRoute.getRoutes());
    this._app.use('/api/admin', adminRoute.getRoutes());
    this._app.use('/api/qna', qnaRoutes.getRoutes());
    this._app.use('/api/users', userRoute.getRoutes());
    this._app.use('/api/sessions', sessionRoutes.getRoutes());
    this._app.use('/api/mentors', mentorRoutes.getRoutes());
    this._app.use('/api/webhook', webhookRoutes.getRoutes());
    this._app.use('/api/wallet', walletRoutes.getRoutes());
    this._app.use('/api/rooms', roomRoutes.getRoutes());
    this._app.use('/api/invites', inviteRoutes.getRoutes());
    this._app.use('/api/plans', planRoute.getRoutes());
    this._app.use('/api/subscriptions', subscriptionRoute.getRoutes());
    this._app.use('/api/code', codeRoutes.getRoutes());
    this._app.use('/api/notifications', notificationRoute.getRoutes());
  }

  private configErrorHanldingMiddleWares() {
    this._app.use(errorHandler);
  }

  private configSocket() {
    socketService.initialize(this._io);

    this._io.on('connection', (socket) => {
      socketHandlers.forEach((handler) => handler.register(this._io, socket));
    });
  }

  private startBackgroundJobs() {
    stripeRefundRetryService.start();
  }

  public async listen() {
    try {
      await initInfisical();
      logLoadedEnv();

      this._io = new SocketIOServer(this._httpServer, {
        cors: {
          origin: env.frontendUrl,
          credentials: true,
        },
      });

      this.configMiddlewares();
      this.configRoutes();
      this.configSocket();
      this.configErrorHanldingMiddleWares();

      await this.configDb();
      this.startBackgroundJobs();
      await initializeRabbitMQConnection();
      hocuspocusService.listen();
      this._httpServer.listen(env.port, () => {
        this._logger.info(`server started at port ${env.port}`);
      });
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error.message);
      } else {
        this._logger.error('Unknown startup error');
      }
      process.exit(1);
    }
  }
}

const app = new App();
app.listen();
