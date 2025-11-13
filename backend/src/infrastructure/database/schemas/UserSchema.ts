import { Document, Schema, Types } from 'mongoose';
import { UserRole } from '../../../domain/types/UserRole';

  export interface UserDocument extends Document{
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password?: string;
    googleId?: string;
    githubId?: string;
    role: UserRole;
    isBlocked: boolean;
    createdAt:Date;
    updatedAt:Date;
  }

export const UserSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    githubId: { type: String, required: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);


