import { model, Model } from 'mongoose';
import { PrivateNoteDocument, privateNoteSchema } from '../../schemas/room/PrivateNoteSchema';

const PrivateNoteModel: Model<PrivateNoteDocument> = model<PrivateNoteDocument>('PrivateNote', privateNoteSchema);

export default PrivateNoteModel;

