import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { GenericRepository } from "./GenericRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import UserModel from "../models/UserModel";
import { UserDocument } from "../../../shared/types";
import { FilterQuery, Model } from "mongoose";
import { UserRole } from "../../../domain/types/UserRole";

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
    sort: string = "createdAt",
    search: string = ""
  ): Promise<UserEntity[]> {
    const query: FilterQuery<UserDocument> = { role };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (currentPage - 1) * pageSize;

    const userDoc = await this._model
      .find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean<UserDocument[]>();

    return userDoc.map((doc) => this.toEntity(doc as UserDocument));
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
      googleId:doc.googleId ?? '',
      githubId:doc.githubId??''    
    };
  }
}
