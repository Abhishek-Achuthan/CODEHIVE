import { injectable, inject } from 'tsyringe';
import type { ICommentRepository } from '../../../domain/interfaces/ICommentRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';

@injectable()
export class DeleteCommentUseCase {
  constructor(@inject('ICommentRepository') private commentRepository: ICommentRepository) {}

  async execute(commentId: string, authorId: string) {
    const comment = await this.commentRepository.find(commentId);
    if (!comment) throw new NotFoundError('Comment not found');

    if (comment.authorId !== authorId) {
      throw new ForbiddenError('You can only delete your own comments');
    }

    await this.commentRepository.delete(commentId);
  }
}
