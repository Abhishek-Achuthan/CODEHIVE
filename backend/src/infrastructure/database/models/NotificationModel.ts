import { NotificationDocument, NotificationSchema } from '../schemas/NotificationSchema';
import { Model, model } from 'mongoose';

const NotificationModel: Model<NotificationDocument> = model<NotificationDocument>('Notification', NotificationSchema);
export default NotificationModel;
