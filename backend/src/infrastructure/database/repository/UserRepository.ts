import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { GenericRepository } from "./GenericRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import UserModel from "../models/UserModel";
import { UserDocument } from "../../../shared/types";
import { Model } from "mongoose";

export class UserRepository extends GenericRepository<UserDocument> implements IUserRepository {

    constructor() {
        super(UserModel as Model<UserDocument>);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this._model.findOne({ email });
    }

}   
