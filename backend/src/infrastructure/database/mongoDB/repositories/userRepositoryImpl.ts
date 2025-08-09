import { IUserRepository } from "../../../../domain/interfaces/repository/user/userRepository";
import { User } from "../../../../domain/entities/user/userEntity";
import { UserModel } from "../models/userModel";


export class UserRepositoryImpl implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({email})

        if(!userDoc) return null;

        return {
            first_name:userDoc.first_name,
            last_name:userDoc.last_name,
            password:userDoc.password,
            email:userDoc.email,
            is_blocked:userDoc.is_blocked,
            id:userDoc.id,
            is_admin:userDoc.is_admin,
            is_mentor:userDoc.is_mentor,
            phone:userDoc.phone,
            slots_used:userDoc.slots_used,
            points:userDoc.points
        }
    }
}