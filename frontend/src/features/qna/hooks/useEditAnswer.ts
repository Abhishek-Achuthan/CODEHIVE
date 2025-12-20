import toast from "react-hot-toast";

import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";

type EditAnswerInput = {
  answerId: string;
  answerText: string;
  version: number;
};

export function useEditAnswer() {
  const editAnswer = async (input: EditAnswerInput): Promise<boolean> => {
    try {
      await QnAService.editAnswer({
        answerId: input.answerId,
        answerText: input.answerText,
        version: input.version,
      });

      toast.success("Answer updated");
      return true;
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message || "Failed to update answer");
      } else {
        toast.error("Failed to update answer");
      }
      return false;
    }
  };

  return { editAnswer };
}
