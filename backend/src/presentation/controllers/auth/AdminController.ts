import { inject, injectable } from "tsyringe";
import type { IListUsersUseCase } from "../../../application/useCase/interface/admin/IListUsersUseCase";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../domain/types/UserRole";
import { HttpStatus } from "../../../shared/httpStatusCode";

@injectable()
export class AdminController {
  constructor(
    @inject("IListUsersUseCase") private readonly _listUsers: IListUsersUseCase
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
}
