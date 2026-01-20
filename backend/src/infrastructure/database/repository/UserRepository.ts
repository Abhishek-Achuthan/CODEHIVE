import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { GenericRepository } from './GenericRepository';
import { UserEntity } from '../../../domain/entities/UserEntity';
import UserModel from '../models/UserModel';
import { UserDocument, UserLeanDoc } from '../schemas/UserSchema';
import { UserRole } from '../../../domain/types/UserRole';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { FilterQuery, Model } from 'mongoose';

export class UserRepository
  extends GenericRepository<UserDocument, UserEntity>
  implements IUserRepository {
  constructor() {
    super(UserModel as Model<UserDocument>);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userDoc = await this._model.findOne({ email });

    if (!userDoc) return null;

    return this.toEntity(userDoc);
  }

  async getAllUsers(
    role: UserRole,
    currentPage: number = 1,
    pageSize: number = 10,
    sort: string = 'createdAt',
    search: string = '',
  ): Promise<PaginationResult<UserEntity>> {
    const query: FilterQuery<UserDocument> = { role };

    const totalItems = await this._model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (currentPage - 1) * pageSize;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const userDoc = await this._model
      .find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean<UserLeanDoc[]>();

    const users = userDoc.map((doc) => this.leanToEntity(doc as UserLeanDoc));

    return { items: users, totalItems, totalPages };
  }
  protected toDocument(data: Partial<UserEntity>): Partial<UserDocument> {
    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      about,
      avatarUrl,
      githubUrl,
      linkedInUrl,
      websiteUrl,
      mentorStatus,
      mentorAppliedAt,
      skills,
      experience,
      role,
      isBlocked,
      googleId,
      githubId,
      experienceLevel,
      primaryExpertise,
    } = data;
    const doc: Partial<UserDocument> = {};
    if (email !== undefined) doc.email = email;
    if (firstName !== undefined) doc.firstName = firstName;
    if (lastName !== undefined) doc.lastName = lastName;
    if (phone !== undefined) doc.phone = phone;
    if (password !== undefined) doc.password = password;
    if (about !== undefined) doc.about = about;
    if (avatarUrl !== undefined) doc.avatarUrl = avatarUrl;
    if (githubUrl !== undefined) doc.githubUrl = githubUrl;
    if (linkedInUrl !== undefined) doc.linkedInUrl = linkedInUrl;
    if (websiteUrl !== undefined) doc.websiteUrl = websiteUrl;
    if (mentorStatus !== undefined) doc.mentorStatus = mentorStatus;
    if (mentorAppliedAt !== undefined) doc.mentorAppliedAt = mentorAppliedAt;
    if (skills !== undefined) doc.skills = skills;
    if (experience !== undefined) doc.experience = experience;
    if (role !== undefined) doc.role = role;
    if (isBlocked !== undefined) doc.isBlocked = isBlocked;
    if (googleId !== undefined) doc.googleId = googleId;
    if (githubId !== undefined) doc.githubId = githubId;
    if (experienceLevel !== undefined) doc.experienceLevel = experienceLevel;
    if (primaryExpertise !== undefined) doc.primaryExpertise = primaryExpertise;

    return doc;
  }

  toEntity(doc: UserDocument): UserEntity {
    return {
      email: doc.email,
      phone: doc.phone ?? '',
      password: doc.password ?? '',
      firstName: doc.firstName,
      lastName: doc.lastName,
      id: doc._id.toString(),
      isBlocked: doc.isBlocked ?? false,
      role: doc.role,
      googleId: doc.googleId ?? '',
      githubId: doc.githubId ?? '',
      skills: doc.skills,
      experience: doc.experience,
      ...(doc.about !== undefined ? { about: doc.about } : {}),
      ...(doc.avatarUrl !== undefined ? { avatarUrl: doc.avatarUrl } : {}),
      ...(doc.githubUrl !== undefined ? { githubUrl: doc.githubUrl } : {}),
      ...(doc.linkedInUrl !== undefined
        ? { linkedInUrl: doc.linkedInUrl }
        : {}),
      ...(doc.websiteUrl !== undefined ? { websiteUrl: doc.websiteUrl } : {}),
      ...(doc.mentorAppliedAt !== undefined
        ? { mentorAppliedAt: doc.mentorAppliedAt }
        : {}),
      mentorStatus: doc.mentorStatus,
      ...(doc.primaryExpertise !== undefined ? { primaryExpertise: doc.primaryExpertise } : {}),
      ...(doc.experienceLevel !== undefined ? { experienceLevel: doc.experienceLevel } : {}),
    };
  }

  leanToEntity(doc: UserLeanDoc): UserEntity {
    return {
      email: doc.email,
      phone: doc.phone ?? '',
      password: doc.password ?? '',
      firstName: doc.firstName,
      lastName: doc.lastName,
      id: doc._id.toString(),
      isBlocked: doc.isBlocked ?? false,
      role: doc.role,
      googleId: doc.googleId ?? '',
      githubId: doc.githubId ?? '',
      skills: doc.skills,
      experience: doc.experience,
      mentorStatus: doc.mentorStatus,
      experienceLevel: doc.experienceLevel,
      primaryExpertise: doc.primaryExpertise,
      ...(doc.about !== undefined ? { about: doc.about } : {}),
      ...(doc.avatarUrl !== undefined ? { avatarUrl: doc.avatarUrl } : {}),
      ...(doc.githubUrl !== undefined ? { githubUrl: doc.githubUrl } : {}),
      ...(doc.linkedInUrl !== undefined
        ? { linkedInUrl: doc.linkedInUrl }
        : {}),
      ...(doc.websiteUrl !== undefined ? { websiteUrl: doc.websiteUrl } : {}),
      ...(doc.mentorAppliedAt !== undefined
        ? { mentorAppliedAt: doc.mentorAppliedAt }
        : {}),
    };
  }
}
