import { inject, injectable } from "tsyringe";
import type { IListUsersUseCase } from "../../../application/useCase/interface/admin/IListUsersUseCase";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../domain/types/UserRole";
import { HttpStatus } from "../../../shared/httpStatusCode";
import type { IUpdateUserStatusUseCase } from "../../../application/useCase/interface/admin/IUpdateUserStatusUseCase";

@injectable()
export class AdminController {
  constructor(
    @inject("IListUsersUseCase") private readonly _listUsers: IListUsersUseCase,
    @inject("IUpdateUserStatusUseCase")
    private readonly _updateUserStatusUseCase: IUpdateUserStatusUseCase
  ) {}

  async handleListUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        role,
        page = "1",
        pageSize = "10",
        sort = "createdAt",
        search = "",
      } = req.query;

      const users = await this._listUsers.execute(
        role as UserRole,
        Number(page),
        Number(pageSize),
        sort as string,
        search as string
      );

      return res.status(HttpStatus.OK).json(users);
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

      res.status(HttpStatus.OK).json({success:true});
    } catch (error) {
      next(error);
    }
  }
}
