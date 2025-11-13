import { UserSchema } from '../schemas/UserSchema';
import { Model, model } from 'mongoose';
import { UserDocument } from '../schemas/UserSchema';


const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);
export default UserModel