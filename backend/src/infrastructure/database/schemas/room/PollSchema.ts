import { Document, Schema } from 'mongoose';

interface PollOptionDocument {
  id: string;
  text: string;
  votedUserIds: string[];
}

export interface PollDocument extends Document {
  _id: Schema.Types.ObjectId;

  roomId: Schema.Types.ObjectId;

  question: string;

  options: PollOptionDocument[];

  createdBy: Schema.Types.ObjectId;

  isActive: boolean;

  allowMultiple: boolean;

  expiresAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface leanPollDocument extends Omit<PollDocument, '_id'> {
  id: string;
}

export interface leanPollOptionDocument extends Omit<PollOptionDocument, '_id'> {
  id: string;
}

export interface leanOptions extends Omit<PollOptionDocument, 'votedUserIds'> {
  votedUserIds: string[];
}


const PollOptionSchema = new Schema<PollOptionDocument>(
  {
    id: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    votedUserIds: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

export const PollSchema = new Schema<PollDocument>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: [PollOptionSchema],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    allowMultiple: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default PollSchema;
