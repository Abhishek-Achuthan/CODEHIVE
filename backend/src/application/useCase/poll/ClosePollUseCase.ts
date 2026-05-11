import { inject, injectable } from "tsyringe";
import { IClosePollUseCase } from "../interface/poll/IClosePollUseCase";
import type { IPollRepository } from "../../../domain/interfaces/IPollRepository";
import { PollEntity } from "../../../domain/entities/room/PollEntity";
import { IClosePollInputDTO } from "../../dto/PollDTO";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ForbiddenError } from "../../../core/errors/ForbiddenError";
import type { IRoomRepository } from "../../../domain/interfaces/IRoomRepository";

@injectable()
export class ClosePollUseCase implements IClosePollUseCase {
  constructor(
    @inject("IPollRepository") private readonly pollRepo: IPollRepository,
    @inject("IUserRepository") private readonly userRepo: IUserRepository,
    @inject("IRoomRepository") private readonly roomRepo: IRoomRepository,
  ) {}

  async execute(data: IClosePollInputDTO): Promise<PollEntity | null> {
    const user = await this.userRepo.find(data.userId);

    if (!user) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);

    const poll = await this.pollRepo.findActivePollByRoomId(data.roomId);

    if (!poll) throw new NotFoundError(ERROR_MESSAGES.POLL.POLL_NOT_FOUND);

    if(poll.id !== data.pollId) throw new NotFoundError(ERROR_MESSAGES.POLL.POLL_NOT_FOUND);

    const room = await this.roomRepo.find(data.roomId);

    if (!room) throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);

    if (data.userId !== poll.createdBy && room.hostId !== data.userId)
      throw new ForbiddenError(ERROR_MESSAGES.POLL.POLL_CREATOR_ONLY);

    const closedPoll = await this.pollRepo.closePoll(data.pollId);

    return closedPoll;
  }
}
