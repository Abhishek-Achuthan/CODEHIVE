import { QuestionEntity } from '../../../../domain/entities/qna/QuestionEntity';
import { EditQuestionInputDTO } from '../../../dto/QuestionDTO';

export interface IEditQuestionUseCase {
    execute(data:EditQuestionInputDTO,questionId:string,userId:string):Promise<QuestionEntity | null>
}