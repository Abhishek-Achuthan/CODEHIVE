import { UserDocument, UserSchema } from '../schemas/UserSchema';
import { Model, model } from 'mongoose';


const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);
export default UserModel