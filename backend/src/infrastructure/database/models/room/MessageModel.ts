import { Model, model } from 'mongoose';
import { MessageDocument, MessageSchema } from '../../schemas/room/MessageSchema';

const MessageModel: Model<MessageDocument> = model<MessageDocument>(
  'Message',
  MessageSchema
);

export default MessageModel;
