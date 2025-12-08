import { useState } from "react";
import type { Answer } from "../../../shared/types/domain/qna";
import type { AnswerListParams } from "../../../shared/types/api/qna";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function useFetchAnswers() {
    const [data, setData] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAnswers = async (params: AnswerListParams) => {
        try {
            setLoading(true);
            const response = await QnAService.listAnswers(params);
            setData(response.items ?? []);
        } catch (error) {
            if(error instanceof BaseError) {
                toast.error(error.message);
            }else{
                toast.error('Something went wrong');
            }
        }finally{
            setLoading(false);
        }
    };
    return {fetchAnswers,data,loading};
};