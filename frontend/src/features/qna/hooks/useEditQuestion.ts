import DOMPurify from "dompurify";
import toast from "react-hot-toast";

import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";

type EditQuestionInput = {
  questionId: string;
  title: string;
  contentHtml: string;
  tags: string[];
  version: number;
};

export function useEditQuestion() {
  const editQuestion = async (input: EditQuestionInput): Promise<boolean> => {
    try {
      await QnAService.editQuestion({
        questionId: input.questionId,
        title: input.title,
        descriptionHtml: DOMPurify.sanitize(input.contentHtml, {
          ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "em",
            "u",
            "code",
            "pre",
            "ul",
            "ol",
            "li",
            "a",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "hr",
            "blockquote",
          ],
          ALLOWED_ATTR: ["href", "target", "rel"],
        }),
        tags: input.tags,
        version: input.version,
      });

      toast.success("Question updated successfully");
      return true;
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update question. Please try again.");
      }
      return false;
    }
  };

  return { editQuestion };
}
