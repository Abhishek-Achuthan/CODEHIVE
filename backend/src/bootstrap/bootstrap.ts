import 'reflect-metadata';
import dotenv from 'dotenv';
import { initInfisical } from '../config/infisicalConfig';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, name: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[BOOT] ${name} connection timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function bootstrap(): Promise<void> {
  try {
    console.log('[BOOT] Loading configuration (Infisical)...');
    dotenv.config();
    await initInfisical();
    console.log('[BOOT] Configuration loaded');

    // Dynamic import of env-dependent modules AFTER Infisical has populated process.env
    const { env, logLoadedEnv } = await import('../config/envConfig.js');
    logLoadedEnv();

    // ── Phase 2: Load DI Container & Application Modules ─────────────────
    console.log('[BOOT] Loading application dependencies...');
    const { container } = await import('tsyringe');
    const { MongodbConfig } = await import('../config/MongodbConfig.js');
    const { initializeRabbitMQConnection } = await import('../config/rabbitMQConfig.js');
    const {
      stripeRefundRetryService,
      hocuspocusService,
      loggerService,
    } = await import('../config/di/resolver.js');
    const { App } = await import('../app.js');

    // ── Phase 3: Infrastructure Phase (Parallel Init with Timeout) ────────
    console.log('[BOOT] Connecting infrastructure (MongoDB, Redis, RabbitMQ in parallel)...');
    const cacheService = container.resolve<any>('ICacheService');

    await Promise.all([
      withTimeout(MongodbConfig.connectDB(), 10000, 'MongoDB'),
      withTimeout(cacheService.connectRedis(), 10000, 'Redis'),
      withTimeout(initializeRabbitMQConnection(), 10000, 'RabbitMQ'),
    ]);
    console.log('[BOOT] Infrastructure ready');

    // ── Phase 4: Create Application & Start Application Services ────────
    console.log('[BOOT] Starting application services...');
    const appInstance = new App();
    
    stripeRefundRetryService.start();
    hocuspocusService.listen();
    console.log('[BOOT] Application services ready');

    // ── Phase 5: Start HTTP Server Last ─────────────────────────────────
    appInstance.httpServer.listen(env.port, () => {
      loggerService.info(`[BOOT] Server started on port ${env.port}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[BOOT] Startup failed:', error.message);
    } else {
      console.error('[BOOT] Unknown startup failure:', error);
    }
    process.exit(1);
  }
}
