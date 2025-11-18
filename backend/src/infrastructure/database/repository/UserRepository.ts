import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { GenericRepository } from './GenericRepository';
import { UserEntity } from '../../../domain/entities/UserEntity';
import UserModel from '../models/UserModel';
import { UserDocument } from '../schemas/UserSchema';
import { FilterQuery, Model } from 'mongoose';
import { UserRole } from '../../../domain/types/UserRole';
import { PaginationResult } from '../../../domain/types/PaginationResult';

export class UserRepository
  extends GenericRepository<UserDocument, UserEntity>
  implements IUserRepository
{
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
    search: string = ''
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
      .lean<UserDocument[]>();

    const users = userDoc.map((doc) => this.toEntity(doc as UserDocument));

    return { items:users, totalItems, totalPages };
  }
  protected toDocument(data: Partial<UserEntity>): Partial<UserDocument> {
    const {
      id,
      email,
      firstName,
      lastName,
      phone,
      password,
      role,
      isBlocked,
      googleId,
      githubId,
    } = data;
    const doc: Partial<UserDocument> = {};
    if (email !== undefined) doc.email = email;
    if (firstName !== undefined) doc.firstName = firstName;
    if (lastName !== undefined) doc.lastName = lastName;
    if (phone !== undefined) doc.phone = phone;
    if (password !== undefined) doc.password = password;
    if (role !== undefined) doc.role = role;
    if (isBlocked !== undefined) doc.isBlocked = isBlocked;
    if (googleId !== undefined) doc.googleId = googleId;
    if (githubId !== undefined) doc.githubId = githubId;
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
    };
  }
}
