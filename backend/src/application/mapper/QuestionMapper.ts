import { QuestionWithAuthor } from '../../domain/types/QuestionWithAuthor';
import { QuestionWithAuthorDTO } from '../dto/QuestionDTO';

export class QuestionMapper {
   public static toQuestionWithAuthor(questionData:QuestionWithAuthor,isBookmarked :boolean):QuestionWithAuthorDTO {
    return {
        question : questionData.question,
        author : questionData.author,
        isBookmarked
    } 
   }
    
}