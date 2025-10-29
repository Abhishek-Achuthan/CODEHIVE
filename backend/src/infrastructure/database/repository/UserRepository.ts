import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { GenericRepository } from "./GenericRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import UserModel from "../models/UserModel";
import { UserDocument } from "../../../shared/types";
import { Model } from "mongoose";

export class UserRepository extends GenericRepository<UserDocument, UserEntity> implements IUserRepository {

    constructor() {
        super(UserModel as Model<UserDocument>);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        let userDoc =  await this._model.findOne({ email })

        if(!userDoc) return null;
        
        return this.toEntity(userDoc)
    }

    toEntity(doc: UserDocument): UserEntity {
        return {
            email: doc.email,
            phone:doc.phone,
            password:doc.password,
            firstName:doc.firstName,
            lastName:doc.lastName,
            id:doc._id.toString(),
            isBlocked:doc.isBlocked,
            role:doc.role,
        }
    }

}   
