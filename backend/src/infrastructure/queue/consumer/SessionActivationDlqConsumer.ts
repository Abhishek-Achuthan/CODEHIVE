import { inject, injectable } from 'tsyringe';
import type { IMessageQueueService } from '../../../application/ports/queue/IMessageQueueService';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';

@injectable()
export class SessionActivationDlqConsumer {
  constructor(
    @inject('IMessageQueueService')
    private readonly _queueService: IMessageQueueService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService
  ) {}

  async start(): Promise<void> {
    const channel = this._queueService.getChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized.');
    }

    try {
      this._logger.info('Starting consumer for Dead Letter Queue: session.activation.dlq');
      await channel.consume('session.activation.dlq', async (msg) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString()) as Record<string, unknown>;
          
          this._logger.error('[DLQ Consumer] Dead-Lettered message received in session.activation.dlq:', {
            payload,
            properties: msg.properties
          });

          channel.ack(msg);
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error';
          this._logger.error('[DLQ Consumer] Failed to process message in DLQ', { error: errMsg });
          channel.ack(msg);
        }
      }, { noAck: false });

      this._logger.info('Session Activation DLQ Consumer started successfully');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this._logger.error('Failed to start Session Activation DLQ Consumer', { error: errMsg });
      throw error;
    }
  }
}
