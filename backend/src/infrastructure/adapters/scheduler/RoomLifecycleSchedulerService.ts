import cron from 'node-cron'
import { inject, injectable } from 'tsyringe'
import type { IActivateUpcomingSessionUseCase } from '../../../application/useCase/interface/room/IActivateUpcomingSessionRoomsUseCase'
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';


@injectable()
export class RoomLifeSchedulerService {
  constructor(
    @inject('IActivateUpcomingSessionUseCase') private readonly _activateUpcomingSessionUseCase: IActivateUpcomingSessionUseCase,
    @inject('ILoggerService') private readonly _loggerService: ILoggerService
  ) { }

  start(): void {
    cron.schedule('* * * * *', async () => {
      try {
        await this._activateUpcomingSessionUseCase.execute();
      } catch (error) {
        if (error instanceof Error) {
          this._loggerService.error(error.message)
        }
      }
    })
  }
}
