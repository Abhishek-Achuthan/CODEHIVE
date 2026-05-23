import { Model, model } from 'mongoose';
import { SubscriptionDocument, SubscriptionSchema } from '../schemas/SubscriptionSchema';

const SubscriptionModel: Model<SubscriptionDocument> = model<SubscriptionDocument>('Subscription', SubscriptionSchema);
export default SubscriptionModel;
