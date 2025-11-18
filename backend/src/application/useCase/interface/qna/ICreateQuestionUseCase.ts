import { ICreateQuestionInputDTO } from '../../../dto/QuestionDTO';

export interface ICreateQuestionUseCase {
  execute(input: ICreateQuestionInputDTO): Promise<void>;
}
