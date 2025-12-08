import { useState } from "react";
import type { CreateAnswerDTO } from "../../../shared/types/qnaTypes";
import { QnAService } from "../../../services/qnaService";
import toast from "react-hot-toast";
import { BaseError } from "../../../shared/errors/BaseError";

export function usePostAnswers() {
    
     const [isPosting,setIsPosting] = useState(false);

    const postAnswer = async (data:CreateAnswerDTO) => {

        try {
            setIsPosting(true);

            const response = await QnAService.postAnswer(data);

            toast.success('Answer posted successfully');

            return response;
            
        } catch (error) {
            if(error instanceof BaseError) {
                toast.error(error.message)
            }
            throw error;
        }finally {
            setIsPosting(false)
        }
    }

    return {postAnswer,isPosting}
}