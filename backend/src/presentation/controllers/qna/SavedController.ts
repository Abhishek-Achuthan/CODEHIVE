import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../shared/httpStatusCode';
import {
  CreateSavedListSchema,
  QuestionListSchema,
  ValidIdSchema,
  ValidListIdSchema,
} from '../../validation/qnaValidations';
import type { ICreateSavedListUseCase } from '../../../application/useCase/interface/qna/ICreateSavedListUseCase';
import type { IListSavedListsUseCase } from '../../../application/useCase/interface/qna/IListSavedListsUseCase';
import type { IListSavedQuestionsUseCase } from '../../../application/useCase/interface/qna/IListSavedQuestionsUseCase';
import type { IListSavedListQuestionsUseCase } from '../../../application/useCase/interface/qna/IListSavedListQuestionsUseCase';
import type { IAddQuestionToSavedListUseCase } from '../../../application/useCase/interface/qna/IAddQuestionToSavedListUseCase';
import type { IRemoveQuestionFromSavedListUseCase } from '../../../application/useCase/interface/qna/IRemoveQuestionFromSavedListUseCase';
import type { IGetSavedListIdsForQuestionUseCase } from '../../../application/useCase/interface/qna/IGetSavedListIdsForQuestionUseCase';
import type { IDeleteSavedListUseCase } from '../../../application/useCase/interface/qna/IDeleteSavedListUseCase';

@injectable()
export class SavedController {
  constructor(
    @inject('ICreateSavedListUseCase')
    private readonly _createSavedListUseCase: ICreateSavedListUseCase,
    @inject('IListSavedListsUseCase')
    private readonly _listSavedListsUseCase: IListSavedListsUseCase,
    @inject('IListSavedQuestionsUseCase')
    private readonly _listSavedQuestionsUseCase: IListSavedQuestionsUseCase,
    @inject('IListSavedListQuestionsUseCase')
    private readonly _listSavedListQuestionsUseCase: IListSavedListQuestionsUseCase,
    @inject('IAddQuestionToSavedListUseCase')
    private readonly _addQuestionToSavedListUseCase: IAddQuestionToSavedListUseCase,
    @inject('IRemoveQuestionFromSavedListUseCase')
    private readonly _removeQuestionFromSavedListUseCase: IRemoveQuestionFromSavedListUseCase,
    @inject('IGetSavedListIdsForQuestionUseCase')
    private readonly _getSavedListIdsForQuestionUseCase: IGetSavedListIdsForQuestionUseCase,
    @inject('IDeleteSavedListUseCase')
    private readonly _deleteSavedListUseCase: IDeleteSavedListUseCase
  ) {}

  async handleCreateList(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { name } = CreateSavedListSchema.parse(req.body);

      const created = await this._createSavedListUseCase.execute(userId, name);

      return res.status(HttpStatus.Created).json(created);
    } catch (error) {
      next(error);
    }
  }

  async handleListLists(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const lists = await this._listSavedListsUseCase.execute(userId);

      return res.status(HttpStatus.OK).json(lists);
    } catch (error) {
      next(error);
    }
  }

  async handleListAllSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const parsedData = QuestionListSchema.parse(req.query);

      const data = await this._listSavedQuestionsUseCase.execute(userId, parsedData);

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleListSavedListQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { listId } = ValidListIdSchema.parse({ listId: req.params.listId });

      const parsedData = QuestionListSchema.parse(req.query);

      const data = await this._listSavedListQuestionsUseCase.execute(userId, listId, parsedData);

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleAddToList(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { listId } = ValidListIdSchema.parse({ listId: req.params.listId });
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.questionId });

      await this._addQuestionToSavedListUseCase.execute(userId, listId, questionId);

      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async handleRemoveFromList(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { listId } = ValidListIdSchema.parse({ listId: req.params.listId });
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.questionId });

      await this._removeQuestionFromSavedListUseCase.execute(userId, listId, questionId);

      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async handleGetListIdsForQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { questionId } = ValidIdSchema.parse({ questionId: req.params.questionId });

      const data = await this._getSavedListIdsForQuestionUseCase.execute(
        userId,
        questionId
      );

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteList(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { listId } = ValidListIdSchema.parse({ listId: req.params.listId });

      await this._deleteSavedListUseCase.execute(userId, listId);

      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
