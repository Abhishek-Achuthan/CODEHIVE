import { CommentSchema } from '../../schemas/qna/CommentSchema';
import { Model, model } from 'mongoose';
import { CommentDoc } from '../../schemas/qna/CommentSchema';

const CommentModel: Model<CommentDoc> = model<CommentDoc>('Comment', CommentSchema);
export default CommentModel;
