import { model } from 'mongoose';
import { RoomDoc, RoomSchema } from '../../schemas/room/RoomSchema';


export const RoomModel = model<RoomDoc>(
  'Room',
   RoomSchema
);