import { model, Model } from 'mongoose';
import { PublicNoteDoc, PublicNoteSchema } from '../../schemas/room/PublicNoteSchema';

const PublicNoteModel: Model<PublicNoteDoc> = model<PublicNoteDoc>('PublicNote', PublicNoteSchema);
export default PublicNoteModel;
