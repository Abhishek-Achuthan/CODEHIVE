import { UserDocument } from "../../../shared/types";
import { UserSchema } from "../schemas/UserSchema";
import { model } from "mongoose";


export default model<UserDocument>('User',UserSchema);
