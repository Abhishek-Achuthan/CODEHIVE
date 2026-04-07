import { RoomDocument, RoomSchema } from '../../schemas/room/RoomSchema';
import { Model, model } from 'mongoose';


const RoomModel: Model<RoomDocument> = model<RoomDocument>('Room', RoomSchema);
export default RoomModel