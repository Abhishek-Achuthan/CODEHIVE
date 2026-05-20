import { ChannelModel, Channel } from 'amqplib';

export interface IMessageQueueService {
  connect(): Promise<void>;
  getConnection(): ChannelModel | undefined;
  getChannel(): Channel | undefined;
}
