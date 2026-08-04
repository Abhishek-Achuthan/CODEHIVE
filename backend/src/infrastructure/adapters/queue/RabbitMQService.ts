import amqp, { ChannelModel, Channel } from 'amqplib';
import { inject, injectable } from 'tsyringe';
import { env } from '../../../config/envConfig';
import { IMessageQueueService } from '../../../application/ports/queue/IMessageQueueService';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';

@injectable()
export class RabbitMQService implements IMessageQueueService {
  private _connection?: ChannelModel;
  private _channel?: Channel;

  constructor(
    @inject('ILoggerService') private readonly _logger: ILoggerService
  ) {}

  async connect(): Promise<void> {
    try {
      this._logger.info('Connecting to RabbitMQ/CloudAMQP...', { url: env.cloudAMQPUrl });
      this._connection = await amqp.connect(env.cloudAMQPUrl);
      this._channel = await this._connection.createChannel();
      this._logger.info('Successfully connected to RabbitMQ and created channel');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this._logger.error('Failed to connect to RabbitMQ/CloudAMQP', { error: errMsg });
      throw error;
    }
  }

  getConnection(): ChannelModel | undefined {
    return this._connection;
  }

  getChannel(): Channel | undefined {
    return this._channel;
  }
}
