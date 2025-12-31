import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";

export function useDeleteQuestion() {
  const navigate = useNavigate();

  const deleteQuestion = async (questionId: string) => {
    try {
      await QnAService.deleteQuestion(questionId);
      toast.success("Question deleted");
      navigate("/qna");
      return true;
    } catch (error) {
      const message = error instanceof BaseError ? error.message : "Failed to delete question";
      toast.error(message);
      return false;
    }
  };

  return { deleteQuestion };
}
