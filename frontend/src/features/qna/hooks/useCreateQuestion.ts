import DOMPurify from "dompurify";
import toast from "react-hot-toast";

import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { BaseError } from "../../../shared/errors/BaseError";
import { QnAService } from "../../../services/qnaService";

type CreateQuestionInput = {
  title: string;
  contentHtml: string;
  tags: string[];
};

export function useCreateQuestion() {
  const userId = useAppSelector((state) => state.auth?.user?.id);

  const createQuestion = async (input: CreateQuestionInput): Promise<boolean> => {
    if (!userId) {
      toast.error("You must be signed in to post a question.");
      return false;
    }

    const safeHtml = DOMPurify.sanitize(input.contentHtml, {
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
    });

    try {
      const res = await QnAService.createQuestion({
        title: input.title.trim(),
        descriptionHtml: safeHtml,
        askedBy: userId,
        tags: input.tags,
      });

      if (res?.message) toast.success(res.message);
      if (res?.messsage) toast.success(res.messsage);

      return true;
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to post Question");
      }
      return false;
    }
  };

  return { createQuestion };
}
