import { Model, model } from 'mongoose';
import {
  AiChatMessageDoc,
  AiChatMessageSchema,
} from '../../schemas/qna/AiChatMessageSchema';

const AiChatMessageModel: Model<AiChatMessageDoc> = model<AiChatMessageDoc>(
  'AiChatMessage',
  AiChatMessageSchema
);
export default AiChatMessageModel;
