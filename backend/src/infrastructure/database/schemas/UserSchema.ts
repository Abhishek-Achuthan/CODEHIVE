import { Document, Schema, Types } from 'mongoose';
import { UserRole } from '../../../domain/types/UserRole';
import { Experience } from '../../../domain/types/ExperienceType';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import { UserLanguage } from '../../../domain/types/UserLanguage';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  about?: string;
  avatarUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  linkedInUrl?: string;
  mentorStatus: MentorStatus;
  mentorAppliedAt?: Date;
  skills: string[];
  languages: UserLanguage[];
  experience: Experience[];
  role: UserRole;
  isBlocked: boolean;
  primaryExpertise: string;
  experienceLevel: string;
  /** Reference to the active subscription Plan. Null = no paid plan. */
  planId?: Types.ObjectId | null;
  banExpirationDate?: Date | null;
  banReason?: string | null;
  bannedAt?: Date | null;
  bannedBy?: Types.ObjectId | null;
  warnCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLeanDoc = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  about?: string;
  avatarUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  linkedInUrl?: string;
  mentorStatus: MentorStatus;
  mentorAppliedAt?: Date;
  skills: string[];
  languages: UserLanguage[];
  experience: Experience[];
  role: UserRole;
  isBlocked: boolean;
  primaryExpertise: string;
  experienceLevel: string;
  /** Reference to the active subscription Plan. Null = no paid plan. */
  planId?: Types.ObjectId | null;
  banExpirationDate?: Date | null;
  banReason?: string | null;
  bannedAt?: Date | null;
  bannedBy?: Types.ObjectId | null;
  warnCount: number;
  createdAt: Date;
  updatedAt: Date;
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
    about: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    githubUrl: { type: String, required: false },
    websiteUrl: { type: String, required: false },
    linkedInUrl: { type: String, required: false },
    mentorStatus: {
      type: String,
      enum: Object.values(MentorStatus),
      default: MentorStatus.NONE,
    },
    mentorAppliedAt: { type: Date, required: false },
    skills: { type: [String], default: [] },
    languages: {
      type: [
        {
          language: { type: String, required: true },
          proficiency: { 
            type: String, 
            enum: ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'],
            required: true 
          }
        }
      ],
      default: []
    },
    experience: {
      type: [
        {
          id: { type: String, required: true },
          type: {
            type: String,
            enum: ['job', 'freelance', 'open_source', 'teaching', 'self_learning'],
            required: true,
          },
          title: { type: String, required: true },
          organization: { type: String, required: false },
          startDate: { type: String, required: false },
          endDate: { type: String, required: false },
          isCurrent: { type: Boolean, required: false },
        },
      ],
      default: [],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isBlocked: { type: Boolean, default: false },
    primaryExpertise: { type: String, required: false },
    experienceLevel: { type: String, required: false },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: false, default: null, index: true },
    banExpirationDate: { type: Date, required: false, default: null },
    banReason: { type: String, required: false, default: null },
    bannedAt: { type: Date, required: false, default: null },
    bannedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    warnCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, mentorStatus: 1, isBlocked: 1 });
UserSchema.index({ skills: 1 });
UserSchema.index({ primaryExpertise: 1, experienceLevel: 1 });

