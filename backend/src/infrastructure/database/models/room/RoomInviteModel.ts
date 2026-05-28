import { model, Model } from 'mongoose';
import {
  RoomInviteDocument,
  RoomInviteSchema,
} from '../../schemas/room/RoomInviteSchema';

const RoomInviteModel: Model<RoomInviteDocument> = model<RoomInviteDocument>(
  'RoomInvite',
  RoomInviteSchema,
);

export default RoomInviteModel;
