import { Model, model } from 'mongoose';
import { PlanDocument, PlanSchema } from '../schemas/PlanSchema';

const PlanModel: Model<PlanDocument> = model<PlanDocument>('Plan', PlanSchema);
export default PlanModel;
