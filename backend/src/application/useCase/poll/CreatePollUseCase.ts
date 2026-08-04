import { inject,injectable } from 'tsyringe';
import { type IPollRepository } from '../../../domain/interfaces/IPollRepository';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ICreatePollInputDTO, ICreatePollOutputDTO } from '../../dto/PollDTO';
import { ICreatePollUseCase } from '../interface/poll/ICreatePollUseCase';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { randomUUID } from 'crypto';
import { RoomAuthorizationService } from '../../services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';


@injectable()
export class CreatePollUseCase implements ICreatePollUseCase {
    constructor(
        @inject('IPollRepository') private readonly _pollRepo : IPollRepository,
        @inject('IUserRepository') private readonly _userRepo : IUserRepository,
        @inject(RoomAuthorizationService)
        private readonly _roomAuthorizationService: RoomAuthorizationService,
    ){}

    async execute(data: ICreatePollInputDTO): Promise<ICreatePollOutputDTO> {
        const user = await this._userRepo.find(data.createdBy)

        if(!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

        const authorizationContext = await this._roomAuthorizationService.assertCapability(
            data.roomId,
            data.createdBy,
            CapabilityKey.ROOM_POLLS_CREATE,
        );

        const poll = await this._pollRepo.create({
            roomId : authorizationContext.room.id,
            createdBy : user.id,
            question: data.question.trim(),
            options : data.options.map((option) => ({
                id : randomUUID(),
                text: option.text.trim(),
                votes: []
            })),
            isActive: true,
            ...(data.allowMultiple !== undefined && { allowMultiple: data.allowMultiple }),
            ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt }),
        });

        return poll
    }
}
