import { model, Model } from 'mongoose';
import { RoomBanDocument, RoomBanSchema } from '../../schemas/room/RoomBanSchema';

const RoomBanModel: Model<RoomBanDocument> = model<RoomBanDocument>(
  'RoomBan',
  RoomBanSchema,
);

export default RoomBanModel;
