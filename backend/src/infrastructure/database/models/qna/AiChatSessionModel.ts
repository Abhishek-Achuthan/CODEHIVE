import { Model, model } from 'mongoose';
import {
  AiChatSessionDoc,
  AiChatSessionSchema,
} from '../../schemas/qna/AiChatSessionSchema';

const AiChatSessionModel: Model<AiChatSessionDoc> = model<AiChatSessionDoc>(
  'AiChatSession',
  AiChatSessionSchema
);
export default AiChatSessionModel;
