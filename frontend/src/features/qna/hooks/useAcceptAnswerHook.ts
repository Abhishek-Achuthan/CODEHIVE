import { useState } from "react";
import { QnAService } from "../../../services/qnaService"
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function useAcceptAnswer() {
    const [acceptedAnsId,setAcceptedAnsId] = useState<string>('') 
    
    const acceptAnswer = async(questionId:string,answerId:string) => {

        try {
            const inputData = {questionId,answerId}
            const data = await QnAService.acceptAnswer(inputData);
            if (data.data?.id) {
              setAcceptedAnsId(data.data.id);
            }
        } catch (error) {
            if(error instanceof BaseError) {
                toast.error(error.message)
            }else {
                toast.error('Something went wrong please try again later');
            }
        }
    }

    return {acceptAnswer,acceptedAnsId};
}