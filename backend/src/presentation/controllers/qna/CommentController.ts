import { injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { CreateCommentUseCase } from '../../../application/useCase/qna/CreateCommentUseCase';
import { GetCommentsUseCase } from '../../../application/useCase/qna/GetCommentsUseCase';
import { UpdateCommentUseCase } from '../../../application/useCase/qna/UpdateCommentUseCase';
import { DeleteCommentUseCase } from '../../../application/useCase/qna/DeleteCommentUseCase';

@injectable()
export class CommentController {
  constructor(
    private createCommentUseCase: CreateCommentUseCase,
    private getCommentsUseCase: GetCommentsUseCase,
    private updateCommentUseCase: UpdateCommentUseCase,
    private deleteCommentUseCase: DeleteCommentUseCase
  ) {}

  async handleCreateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const answerId = req.params.answerId as string;
      const { content } = req.body;
      const authorId = req.user?.id as string;

      if (!content || !content.trim()) {
         return res.status(400).json({ success: false, message: 'Content is required' });
      }

      const comment = await this.createCommentUseCase.execute(answerId, authorId, content.trim());
      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async handleGetComments(req: Request, res: Response, next: NextFunction) {
    try {
      const answerId = req.params.answerId as string;
      const comments = await this.getCommentsUseCase.execute(answerId);
      res.status(200).json({ success: true, data: comments });
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const commentId = req.params.commentId as string;
      const { content } = req.body;
      const authorId = req.user?.id as string;

      if (!content || !content.trim()) {
         return res.status(400).json({ success: false, message: 'Content is required' });
      }

      const comment = await this.updateCommentUseCase.execute(commentId, authorId, content.trim());
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const commentId = req.params.commentId as string;
      const authorId = req.user?.id as string;

      await this.deleteCommentUseCase.execute(commentId, authorId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
