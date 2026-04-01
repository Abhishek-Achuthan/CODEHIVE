import mongoose, { FilterQuery, Model } from 'mongoose';
import { UserEntity } from '../../../domain/entities/UserEntity';
import UserModel from '../models/UserModel';
import { UserDocument, UserLeanDoc } from '../schemas/UserSchema';
import { GenericRepository } from './GenericRepository';
import { IMentorRepository } from '../../../domain/interfaces/IMentorRepository';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorListOptions } from '../../../domain/types/MentorListOptions';
import { MentorStatus } from '../../../domain/types/MentorStatus';


export class MentorRepository extends GenericRepository<UserDocument, UserEntity> implements IMentorRepository {
  constructor() {
    super(UserModel as Model<UserDocument>)
  }

  async findMentorsExcludeSelf(userId: string, options: MentorListOptions): Promise<PaginationResult<UserEntity>> {
    const { limit = 10, page = 1, search } = options;

    const skip = (page - 1) * limit;

    const query: FilterQuery<UserDocument> = {
      role: UserRole.MENTOR,
      mentorStatus: MentorStatus.APPROVED,
      isBlocked: false,
      _id: { $ne: new mongoose.Types.ObjectId(userId) }
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const totalItems = await this._model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const userDoc = await this._model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<UserLeanDoc[]>();

    const mentors = userDoc.map((doc) => this.leanToEntity(doc));

    return { items: mentors, totalItems, totalPages };

  }

  protected toEntity(doc: UserDocument): UserEntity {
    return {
      id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      skills: doc.skills,
      experience: doc.experience,
      isBlocked: doc.isBlocked,
      mentorStatus: doc.mentorStatus,
      role: doc.role,
      ...(doc.about !== undefined && { about: doc.about }),
      ...(doc.avatarUrl !== undefined && { avatarUrl: doc.avatarUrl }),
      ...(doc.githubUrl !== undefined && { githubUrl: doc.githubUrl }),
      ...(doc.linkedInUrl !== undefined && { linkedInUrl: doc.linkedInUrl }),
      ...(doc.websiteUrl !== undefined && { websiteUrl: doc.websiteUrl }),
      ...(doc.phone !== undefined && { phone: doc.phone }),
      ...(doc.password !== undefined && { password: doc.password }),
      ...(doc.googleId !== undefined && { googleId: doc.googleId }),
      ...(doc.githubId !== undefined && { githubId: doc.githubId }),
      ...(doc.primaryExpertise !== undefined && { primaryExpertise: doc.primaryExpertise }),
      ...(doc.experienceLevel !== undefined && { experienceLevel: doc.experienceLevel }),
      ...(doc.mentorAppliedAt !== undefined && { mentorAppliedAt: doc.mentorAppliedAt }),
    };
  }

  protected toDocument(data: Partial<UserEntity>): Partial<UserDocument> {
    const doc: Partial<UserDocument> = {};
    if (data.firstName !== undefined) doc.firstName = data.firstName;
    if (data.lastName !== undefined) doc.lastName = data.lastName;
    if (data.email !== undefined) doc.email = data.email;
    if (data.about !== undefined) doc.about = data.about;
    if (data.skills !== undefined) doc.skills = data.skills;
    if (data.experience !== undefined) doc.experience = data.experience;
    if (data.avatarUrl !== undefined) doc.avatarUrl = data.avatarUrl;
    if (data.githubUrl !== undefined) doc.githubUrl = data.githubUrl;
    if (data.linkedInUrl !== undefined) doc.linkedInUrl = data.linkedInUrl;
    if (data.websiteUrl !== undefined) doc.websiteUrl = data.websiteUrl;
    if (data.phone !== undefined) doc.phone = data.phone;
    if (data.password !== undefined) doc.password = data.password;
    if (data.googleId !== undefined) doc.googleId = data.googleId;
    if (data.githubId !== undefined) doc.githubId = data.githubId;
    if (data.primaryExpertise !== undefined) doc.primaryExpertise = data.primaryExpertise;
    if (data.experienceLevel !== undefined) doc.experienceLevel = data.experienceLevel;
    if (data.isBlocked !== undefined) doc.isBlocked = data.isBlocked;
    if (data.mentorAppliedAt !== undefined) doc.mentorAppliedAt = data.mentorAppliedAt;
    if (data.mentorStatus !== undefined) doc.mentorStatus = data.mentorStatus;
    if (data.role !== undefined) doc.role = data.role;
    return doc;
  }


  leanToEntity(data: UserLeanDoc): UserEntity {
    return {
      id: data._id.toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      isBlocked: data.isBlocked ?? false,
      skills: data.skills,
      experience: data.experience,
      mentorStatus: data.mentorStatus,
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.password !== undefined && { password: data.password }),
      ...(data.googleId !== undefined && { googleId: data.googleId }),
      ...(data.githubId !== undefined && { githubId: data.githubId }),
      ...(data.primaryExpertise !== undefined && { primaryExpertise: data.primaryExpertise }),
      ...(data.experienceLevel !== undefined && { experienceLevel: data.experienceLevel }),
      ...(data.mentorAppliedAt !== undefined && { mentorAppliedAt: data.mentorAppliedAt }),
      ...(data.about !== undefined && { about: data.about }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
      ...(data.linkedInUrl !== undefined && { linkedInUrl: data.linkedInUrl }),
      ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
    };
  }
}
