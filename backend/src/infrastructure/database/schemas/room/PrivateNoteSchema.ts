import { Document, Schema } from 'mongoose';

export interface PrivateNoteDocument extends Document {
  _id: Schema.Types.ObjectId;
  roomId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export const privateNoteSchema = new Schema<PrivateNoteDocument>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: Schema.Types.Mixed,
      required: true,
      default: {
        type: 'doc',
        content: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

privateNoteSchema.index(
  {
    roomId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);



