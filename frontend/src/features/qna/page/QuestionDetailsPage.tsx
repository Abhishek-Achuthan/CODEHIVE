import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { useBookmarkQuestion } from "../hooks/useBookmarkQuestion";
import { useFetchQuestion } from "../hooks/useFetchQuestion";

import QnaLayout from "../../../layouts/QnaLayout";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { QuestionHeaderSection } from "../components/QuestionDetailsHeaderSection";
import { RelatedQuestionsSection } from "../components/RelatetdQuestionSection";
import AnswerEditorSection from "../components/AnswerEditorSection";
import type { GetQuestionData, Answer } from "../../../shared/types/domain/qna";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import { usePostAnswers } from "../hooks/usePostAnswers";
import { useFetchAnswers } from "../hooks/useFetchAnswers";
import { parseDate, timeAgo } from "../../../shared/utils/dateUtils";
import { useAppSelector } from "../../../shared/hooks/storeHooks";


const QuestionDetailsPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();

  const { data, loading, relatedQuestions } = useFetchQuestion(questionId);

  const {fetchAnswers,data:answers, loading : answersLoading} = useFetchAnswers();

  const currentUser = useAppSelector((state) => state.auth.user);
  console.log(currentUser)

  const { isBookmarked, toggleBookmark } = useBookmarkQuestion(
    questionId,
    data?.isBookmarked
  );

  const [localAnswers, setLocalAnswers] = useState<Answer[]>([]);
  const { postAnswer, isPosting } = usePostAnswers();

  useEffect(() => {
    if (!questionId) return;

    void fetchAnswers({
      questionId,
      page: 1,
      limit: 10,
      sortBy: 'newest',
    });
  }, [questionId, fetchAnswers]);

  const allAnswers: Answer[] = [
    ...localAnswers,
    ...(answers ?? []),
  ];


  const handleSubmitHtml = async (html: string): Promise<void> => {
    if (!questionId) return;

    const now = new Date().toISOString();

    const tempAnswer: Answer = {
      id: `temp-${Date.now()}`,
      answerText: html,
      isAccepted: false,
      voteCount: 0,
      createdAt: now,
      updatedAt: now,
      author: {
        id: currentUser?.id,
        firstName: currentUser?.firstName,
        email: currentUser?.email,
      },
    };

    setLocalAnswers((prev) => [tempAnswer, ...prev]);

    try {
      const created = await postAnswer({ questionId, answerText: html });
      setLocalAnswers((prev) =>
        prev.map((a) => (a.id === tempAnswer.id ? created : a))
      );
    } catch (error) {
      setLocalAnswers((prev) => prev.filter((a) => a.id !== tempAnswer.id));
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
    }
  };

  if (loading || answersLoading) {
    return <QuesDetailPageSkelton />;
  }

  if (!data) {
    return (
      <QnaLayout>
        <div className="flex flex-1 items-center justify-center text-zinc-400">
          Failed to load question.
        </div>
      </QnaLayout>
    );
  }

  return (
    <QnaLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <QuestionHeaderSection
              data={data as GetQuestionData}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
            />

            <AnswerEditorSection
              initialHtml={undefined}
              onSubmitHtml={handleSubmitHtml}
              isPosting={isPosting}
            />

            <div className="mt-8 space-y-6">
              {allAnswers.length === 0 ? (
                <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 text-center text-zinc-400">
                  No answers yet — be the first to help.
                </div>
              ) : (
                allAnswers.map((a) => (
                  <article
                    key={a.id}
                    className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 max-h-[24vh] overflow-auto"
                  >
                    <div
                      // make prose full-width, preserve newlines, and wrap very long tokens
                      className="prose prose-invert max-w-none text-sm mb-3 whitespace-pre-wrap wrap-break-words"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(a.answerText),
                      }}
                    />
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{a.voteCount}</span>
                        <span>votes</span>
                        <span>•</span>
                        <span>{timeAgo(parseDate(a.createdAt))}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white font-semibold">
                          {a.author?.firstName ?? "you"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))             
              )}
            </div>
          </div>
        </div>

        <RelatedQuestionsSection relatedQuestions={relatedQuestions} />
      </div>
    </QnaLayout>
  );
};

export default QuestionDetailsPage;
