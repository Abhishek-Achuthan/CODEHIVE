import { Schema } from "mongoose";
import { User } from "../../../../domain/entities/user/userEntity";

export const userSchema = new Schema<User>({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Email address is required for user registration"],
    unique: [true, "document with same email exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required for user registration"],
  },
  phone: {
    type: String,
  },
  is_blocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  points : {
    type : Number,
  },
  slots_used : {
    type : Number,
  }
});
