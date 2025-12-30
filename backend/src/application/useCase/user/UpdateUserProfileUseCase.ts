import { inject,injectable } from 'tsyringe';
import { IUpdateUserProfileUseCase } from '../interface/user/IUpdateUserProfileUseCase';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UpdateUserProfileDTO, IUserProfileResponseDTO } from '../../dto/UserDTO';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserMapper } from '../../mapper/UserMapper';
import { UserEntity } from '../../../domain/entities/UserEntity';


@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository,

    ) {}

    async execute(data: UpdateUserProfileDTO,userId:string): Promise<IUserProfileResponseDTO> {
        
        const user = await this._userRepository.find(userId);


        if(!user) throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);

        const updatedProfile = await this._userRepository.update(
            user.id,
            data as Partial<UserEntity>
        );

       const mappedUser = UserMapper.toUserProfileResponse(updatedProfile!);

       return mappedUser;
    }
}