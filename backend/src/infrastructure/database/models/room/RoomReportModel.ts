import { model, models } from 'mongoose';
import { RoomReportDocument, RoomReportSchema } from '../../schemas/room/RoomReportSchema';

const RoomReportModel = models.RoomReport || model<RoomReportDocument>('RoomReport', RoomReportSchema);

export default RoomReportModel;
