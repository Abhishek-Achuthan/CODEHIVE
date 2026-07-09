import { type IUserActivityStatsDTO } from "../../../dto/UserDTO";

export interface IGetUserActivityUseCase {
  execute(userId: string): Promise<IUserActivityStatsDTO>;
}
