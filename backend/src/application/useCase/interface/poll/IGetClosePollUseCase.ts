import { PollEntity } from "../../../../domain/entities/room/PollEntity";

export interface IGetClosePollUseCase {
    execute(roomId : string): Promise<PollEntity[]>;
};
