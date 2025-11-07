import { UserDocument } from '../../../shared/types';
import { UserSchema } from '../schemas/UserSchema';
import { Model, model } from 'mongoose';


const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);
export default UserModel