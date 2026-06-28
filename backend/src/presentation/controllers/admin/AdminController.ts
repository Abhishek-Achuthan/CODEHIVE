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
import type { IGetAdminReportsUseCase } from '../../../application/useCase/admin/GetAdminReportsUseCase';
import type { IUpdateReportStatusUseCase } from '../../../application/useCase/admin/UpdateReportStatusUseCase';
import type { IGetAdminRoomChatHistoryUseCase } from '../../../application/useCase/admin/GetAdminRoomChatHistoryUseCase';
import type { IBanUserUseCase } from '../../../application/useCase/admin/BanUserUseCase';
import type { IUnbanUserUseCase } from '../../../application/useCase/admin/UnbanUserUseCase';
import type { IWarnUserUseCase } from '../../../application/useCase/admin/WarnUserUseCase';

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
    private readonly _updateMentorStatusUseCase: IUpdateMentorStatusUseCase,
    @inject('IGetAdminReportsUseCase')
    private readonly _getAdminReportsUseCase: IGetAdminReportsUseCase,
    @inject('IUpdateReportStatusUseCase')
    private readonly _updateReportStatusUseCase: IUpdateReportStatusUseCase,
    @inject('IGetAdminRoomChatHistoryUseCase')
    private readonly _getAdminRoomChatHistoryUseCase: IGetAdminRoomChatHistoryUseCase,
    @inject('IBanUserUseCase')
    private readonly _banUserUseCase: IBanUserUseCase,
    @inject('IUnbanUserUseCase')
    private readonly _unbanUserUseCase: IUnbanUserUseCase,
    @inject('IWarnUserUseCase')
    private readonly _warnUserUseCase: IWarnUserUseCase,
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

  async handleListReports(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const data = await this._getAdminReportsUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateReportStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(HttpStatus.BadRequest).json({ message: 'Missing report id' });
      }
      
      const adminId = req.user?.id as string;
      const updated = await this._updateReportStatusUseCase.execute(id as string, status, adminId);
      res.status(HttpStatus.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async handleGetRoomChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      
      if (!roomId) {
        return res.status(HttpStatus.BadRequest).json({ message: 'Missing room id' });
      }
      
      const messages = await this._getAdminRoomChatHistoryUseCase.execute(roomId as string);
      res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      next(error);
    }
  }

  async handleBanUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { durationInDays, reason } = req.body;
      const adminId = req.user?.id as string;

      if (!userId || !reason) {
        return res.status(HttpStatus.BadRequest).json({ message: 'Missing userId or reason' });
      }

      const updatedUser = await this._banUserUseCase.execute(userId, durationInDays || null, reason, adminId);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async handleUnbanUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(HttpStatus.BadRequest).json({ message: 'Missing userId' });
      }

      const updatedUser = await this._unbanUserUseCase.execute(userId);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async handleWarnUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;

      if (!userId || !reason) {
        return res.status(HttpStatus.BadRequest).json({ message: 'Missing userId or reason' });
      }

      const updatedUser = await this._warnUserUseCase.execute(userId, reason);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
