import { injectable, inject } from 'tsyringe';
import type { IGetMentorReviewsUseCase } from '../interface/session/IGetMentorReviewsUseCase';
import type { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';

@injectable()
export class GetMentorReviewsUseCase implements IGetMentorReviewsUseCase {
  constructor(
    @inject('IReviewRepository') private reviewRepository: IReviewRepository
  ) {}

  async execute(mentorId: string): Promise<any[]> {
    return this.reviewRepository.findByMentorId(mentorId);
  }
}
