import { useCallback, useEffect, useState } from "react";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function useBookmarkQuestion(questionId:string | undefined,initialValue:boolean | undefined) {

    const [isBookmarked,setIsBookmarked] = useState<boolean>(false);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(typeof initialValue ==='boolean') {
            setIsBookmarked(initialValue);
        }
    },[initialValue])

    const toggleBookmark = useCallback(async () => {
        if(!questionId || loading) return;
        
        try {
            setLoading(true);
            const response = await QnAService.saveQuestion(questionId);
            setIsBookmarked(response.data);
            toast.success(response.message); 
        } catch (error) {
            if(error instanceof BaseError) {
                toast.error(error.message);
            }
        }finally {
            setLoading(false);
        }
},[questionId,loading])

    return  {isBookmarked,toggleBookmark,loading,setIsBookmarked};
    
}