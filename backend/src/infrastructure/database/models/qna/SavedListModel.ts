import { Model, model } from 'mongoose';
import { SavedListDoc, SavedListSchema } from '../../schemas/qna/SavedListSchema';

const SavedListModel: Model<SavedListDoc> = model<SavedListDoc>(
  'SavedList',
  SavedListSchema
);

export default SavedListModel;
