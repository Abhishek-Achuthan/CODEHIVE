import { VoteSchema } from '../../schemas/qna/VoteSchema';
import { Model,model } from 'mongoose';
import { VoteDoc } from '../../schemas/qna/VoteSchema';

const VoteModel: Model<VoteDoc> = model<VoteDoc>('Vote',VoteSchema);
export default VoteModel