import { inject, injectable } from 'tsyringe';
import type { IListUsersUseCase } from '../../../application/useCase/interface/admin/IListUsersUseCase';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../../domain/types/UserRole';
import { HttpStatus } from '../../../shared/httpStatusCode';
import type { IUpdateUserStatusUseCase } from '../../../application/useCase/interface/admin/IUpdateUserStatusUseCase';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { type IListMentorApplicationUseCase } from '../../../application/useCase/interface/admin/IListMentorApplicationUseCase';
import { type IUpdateMentorStatusUseCase } from '../../../application/useCase/interface/admin/IUpdateMentorStatusUseCase';

@injectable()
export class AdminController {
  constructor(
    @inject('IListUsersUseCase')
    private readonly _listUsers: IListUsersUseCase,
    @inject('IUpdateUserStatusUseCase')
    private readonly _updateUserStatusUseCase: IUpdateUserStatusUseCase,
    @inject('IListMentorApplicationUseCase')
    private readonly _listMentorApplicationUseCase: IListMentorApplicationUseCase,
    @inject('IUpdateMentorStatusUseCase')
    private readonly _updateMentorStatusUseCase: IUpdateMentorStatusUseCase
  ) { }

  async handleListUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        role,
        page = '1',
        pageSize = '10',
        sort = 'createdAt',
        search = '',
      } = req.query;

      const data = await this._listUsers.execute(
        role as UserRole,
        Number(page),
        Number(pageSize),
        sort as string,
        search as string
      );

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, status } = req.body;

      await this._updateUserStatusUseCase.execute(id, status);

      res.status(HttpStatus.OK).json({ success: true, message: RESPONSE_MESSAGES.ADMIN.USER_STATUS_UPDATE });
    } catch (error) {
      next(error);
    }
  }

  async handleListMentorApplications(req: Request, res: Response, next: NextFunction) {

    try {
      const { pageSize, currentPage, search } = req.query;

      const data = await this._listMentorApplicationUseCase.execute(Number(currentPage), Number(pageSize), String(search));

      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateMentorStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, status } = req.body;

      if (!id || !status || (status !== 'approved' && status !== 'rejected')) {
        return res
          .status(HttpStatus.OK)
          .json({ message: ERROR_MESSAGES.ADMIN.INVALID_MENTOR_STATUS_REQUEST });
      }

      await this._updateMentorStatusUseCase.execute(id, status);

      res.status(HttpStatus.OK).json({
        success: true,
        message:
          status === 'approved'
            ? RESPONSE_MESSAGES.ADMIN.MENTOR_APPLICATION_APPROVED
            : RESPONSE_MESSAGES.ADMIN.MENTOR_APPLICATION_REJECTED,
      });
    } catch (error) {
      next(error);
    }
  }
}
