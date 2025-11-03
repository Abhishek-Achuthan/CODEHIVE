import { inject,injectable } from "tsyringe";
import { IUpdateUserStatusUseCase } from "../interface/admin/IUpdateUserStatusUseCase";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { NotFoundError } from "../../../core/errors/NotFoundError";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase  {

    constructor(
        @inject('IUserRepository') private readonly _userRepository : IUserRepository,
    ) {}

    async execute(id:string,isBlocked:boolean): Promise<void> {
        const user = await this._userRepository.find(id);

        if(!user) throw new NotFoundError('User not found');

        user.isBlocked = isBlocked;

        await this._userRepository.update(id,{isBlocked: user.isBlocked});
    }
}