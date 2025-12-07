import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useBookmarkQuestion } from "../hooks/useBookmarkQuestion";
import { useFetchQuestion } from "../hooks/useFetchQuestion";

import QnaLayout from "../../../layouts/QnaLayout";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { QuestionHeaderSection } from "../components/QuestionDetailsHeaderSection";
import { AnswerEditorSection } from "../components/AnswerEditorSection";
import { RelatedQuestionsSection } from "../components/RelatetdQuestionSection";

const QuestionDetailsPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();

  const [answerText, setAnswerText] = useState("");
  const [editorFocused, setEditorFocused] = useState(false);

  const { data, loading, relatedQuestions } = useFetchQuestion(questionId);

  const { isBookmarked, toggleBookmark } = useBookmarkQuestion(
    questionId,
    data?.isBookmarked
  );

  const handlePostAnswer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnswerText("");
  };

  if (loading) {
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
              data={data}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
            />

            <AnswerEditorSection
              answerText={answerText}
              editorFocused={editorFocused}
              onChangeAnswer={(value) => setAnswerText(value)}
              onFocusEditor={() => setEditorFocused(true)}
              onBlurEditor={() => setEditorFocused(false)}
              onSubmit={handlePostAnswer}
            />
          </div>
        </div>

        <RelatedQuestionsSection relatedQuestions={relatedQuestions} />
      </div>
    </QnaLayout>
  );
};

export default QuestionDetailsPage;
