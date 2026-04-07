import { ParticipantDocument,ParticipantSchema } from '../../schemas/room/ParticipantSchema';
import { Model, model } from 'mongoose';


const ParticipantModel: Model<ParticipantDocument> = model<ParticipantDocument>('Participant', ParticipantSchema);
export default ParticipantModel