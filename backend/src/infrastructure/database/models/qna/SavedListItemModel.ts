import { Model, model } from 'mongoose';
import {
  SavedListItemDoc,
  SavedListItemSchema,
} from '../../schemas/qna/SavedListItemSchema';

const SavedListItemModel: Model<SavedListItemDoc> = model<SavedListItemDoc>(
  'SavedListItem',
  SavedListItemSchema
);

export default SavedListItemModel;
