import { inject, injectable } from 'tsyringe';
import type { IMessageQueueService } from '../../../application/ports/queue/IMessageQueueService';
import type { IActivateUpcomingSessionUseCase } from '../../../application/useCase/interface/room/IActivateUpcomingSessionRoomsUseCase';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';

@injectable()
export class SessionActivationConsumer {
  constructor(
    @inject('IMessageQueueService')
    private readonly _queueService: IMessageQueueService,
    @inject('IActivateUpcomingSessionUseCase')
    private readonly _activateUseCase: IActivateUpcomingSessionUseCase,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService
  ) {}

  async start(): Promise<void> {
    
    const channel = this._queueService.getChannel();

    if (!channel) throw new Error('RabbitMQ channel is not initialized.');
    

    try {
      this._logger.info('Starting consumer for queue: session.activation.queue');
      await channel.consume('session.activation.queue', async (msg) => {
        if (!msg) return;

        let sessionId = '';
        let retryCount = 0;

        try {
          const payload = JSON.parse(msg.content.toString()) as Record<string, unknown>;
          sessionId = payload.sessionId as string;
          retryCount = (payload.retryCount as number) || 0;

          this._logger.info(`[Queue Consumer] Consuming activation event for session: ${sessionId} (Attempt: ${retryCount + 1})`);
          
          await this._activateUseCase.execute(sessionId);
          
          channel.ack(msg);
          this._logger.info(`[Queue Consumer] Successfully activated session: ${sessionId}. Acknowledged message.`);
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error';
          this._logger.error(`[Queue Consumer] Error activating session: ${sessionId || 'unknown'}`, { error: errMsg });

          if (sessionId && retryCount < 3) {
            const nextAttempt = retryCount + 1;
            this._logger.warn(`[Queue Consumer] Scheduling 1-minute retry for session: ${sessionId} (Attempt: ${nextAttempt}/3)...`);
            
            try {
              const retryPayload = { sessionId, retryCount: nextAttempt };
              const buffer = Buffer.from(JSON.stringify(retryPayload));
              
              channel.publish('session.delayed.exchange', 'session.activate', buffer, {
                headers: { 'x-delay': 60000 },
                persistent: true
              });
              channel.ack(msg); 
            } catch (publishError) {
              const pubErrMsg = publishError instanceof Error ? publishError.message : 'Unknown error';
              this._logger.error(`[Queue Consumer] Failed to schedule retry message for session: ${sessionId}. Re-queueing original message.`, { error: pubErrMsg });
              channel.nack(msg, false, true); 
            }
          } else {
            this._logger.error(`[Queue Consumer] Session activation failed after 3 attempts or invalid payload. Nacking to DLQ.`, { sessionId });
            channel.nack(msg, false, false);
          }
        }
      }, { noAck: false });

      this._logger.info('Session Activation Consumer started successfully');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this._logger.error('Failed to start Session Activation Consumer', { error: errMsg });
      throw error;
    }
  }
}
