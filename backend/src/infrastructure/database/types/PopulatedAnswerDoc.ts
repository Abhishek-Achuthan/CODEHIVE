import { AnswerLeanDoc } from '../schemas/qna/AnswerSchema'
import { UserLeanDoc } from '../schemas/UserSchema'

export type PopulatedAnswerDoc = Omit<AnswerLeanDoc,'userId'> & {
    answeredBy:UserLeanDoc
}