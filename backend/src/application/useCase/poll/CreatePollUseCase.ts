import { inject,injectable } from "tsyringe";
import { type IPollRepository } from "../../../domain/interfaces/IPollRepository";
import { type IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { type IRoomRepository } from "../../../domain/interfaces/IRoomRepository";
import { ICreatePollInputDTO, ICreatePollOutputDTO } from "../../dto/PollDTO";
import { ICreatePollUseCase } from "../interface/poll/ICreatePollUseCase";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { randomUUID } from "crypto";


@injectable()
export class CreatePollUseCase implements ICreatePollUseCase {
    constructor(
        @inject("IPollRepository") private readonly _pollRepo : IPollRepository,
        @inject("IRoomRepository") private readonly _roomRepo : IRoomRepository,
        @inject("IUserRepository") private readonly _userRepo : IUserRepository
    ){}

    async execute(data: ICreatePollInputDTO): Promise<ICreatePollOutputDTO> {
        const user = await this._userRepo.find(data.createdBy)

        if(!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

        const room = await this._roomRepo.find(data.roomId);

        if(!room) throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);

        const poll = await this._pollRepo.create({
            roomId : room.id,
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
