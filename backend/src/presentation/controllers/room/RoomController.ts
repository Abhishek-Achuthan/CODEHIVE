import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import type { ICreateRoomUseCase } from '../../../application/useCase/interface/room/ICreateRoomUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import type { IGetPublicRoomsUseCase } from '../../../application/useCase/interface/room/IGetPublicRoomsUseCase';

@injectable()
export class RoomController {
  constructor(
    @inject('ICreateRoomUseCase')
    private readonly _createRoomUseCase: ICreateRoomUseCase,
    @inject('IGetPublicRoomsUseCase')
    private readonly _getPublicRoomsUseCase: IGetPublicRoomsUseCase,
  ) {}

  async handleCreateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { title, description, visibility } = req.body;

      const room = await this._createRoomUseCase.execute({
        title,
        description,
        visibility,
        userId,
      });

      res.status(HttpStatus.Created).json(room);
    } catch (error) {
      next(error);
    }
  }

  async handleGetPublicRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const pageParam = Number(req.query.page);
      const limitParam = Number(req.query.limit);

      const page = pageParam || 1;
      const limit = limitParam || 5

      const rooms = await this._getPublicRoomsUseCase.execute({page,limit});

      res.status(HttpStatus.OK).json(rooms);
    } catch (error) {
      next(error);
    }
  }
}
