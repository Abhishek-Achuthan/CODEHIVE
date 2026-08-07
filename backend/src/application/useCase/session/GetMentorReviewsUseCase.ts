import { injectable, inject } from 'tsyringe';
import type {
  GetMentorReviewsResult,
  IGetMentorReviewsUseCase,
} from '../interface/session/IGetMentorReviewsUseCase';
import type { IReviewRepository } from '../../../domain/interfaces/IReviewRepository';

@injectable()
export class GetMentorReviewsUseCase implements IGetMentorReviewsUseCase {
  constructor(
    @inject('IReviewRepository') private reviewRepository: IReviewRepository
  ) {}

  async execute(mentorId: string, page: number = 1, limit: number = 10): Promise<GetMentorReviewsResult> {
    return this.reviewRepository.findByMentorId(mentorId, page, limit);
  }
}
