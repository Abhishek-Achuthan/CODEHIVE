import { Schema, Document,Types } from 'mongoose'

export interface PublicNoteDoc extends Document {
  _id: Types.ObjectId;
  roomId: string;
  content: string;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicNoteLeanDoc {
  _id: Schema.Types.ObjectId;
  roomId: string;
  content: string;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const PublicNoteSchema = new Schema<PublicNoteDoc>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      default: '',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  { timestamps: true }
);

PublicNoteSchema.index({ roomid:1 });
