import React from "react";
import { useParams } from "react-router-dom";
import QnaLayout from "../../../layouts/QnaLayout";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { QuestionHeaderSection } from "../components/QuestionDetailsHeaderSection";
import { RelatedQuestionsSection } from "../components/RelatetdQuestionSection";
import AnswerEditorSection from "../components/AnswerEditorSection";
import { QuestionAnswersSection } from "../components/QuestionAnswersSection";
import { useQuestionDetails } from "../hooks/useQuestionDetails";
import { useDeleteQuestion } from "../hooks/useDeleteQuestion";
import { useAppSelector } from "../../../shared/hooks/storeHooks";

const QuestionDetailsPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { deleteQuestion } = useDeleteQuestion();

  const controller = useQuestionDetails(questionId);

  if (controller.loading) {
    return <QuesDetailPageSkelton />;
  }

  if (!controller.question) {
    return (
      <QnaLayout>
        <div className="flex flex-1 items-center justify-center text-zinc-400">
          Failed to load question.
        </div>
      </QnaLayout>
    );
  }

  const {
    question,
    relatedQuestions,
    isBookmarked,
    totalAnswers,
    totalPages,
    currentPage,
    searchTerm,
    sortBy,
    questionVote,
    actions,
    answerVotes,
    answers,
    answersLoading,
    hasMoreAnswers,
    isPostingAnswer
  } = controller;

  const effectiveAcceptedAnswerId = answersLoading
    ? question.acceptedAnswerId
    : (answers.find((a) => a.isAccepted)?.id ?? null);

  return (
    <QnaLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <QuestionHeaderSection
              data={question}
              isBookmarked={isBookmarked}
              onToggleBookmark={actions.toggleBookmark}
              votes={questionVote.count}
              userVote={questionVote.userVote}
              onUpvote={() => questionVote.vote(1)}
              onDownvote={() => questionVote.vote(-1)}
              onDeleteQuestion={() => questionId && deleteQuestion(questionId)}
            />

            {effectiveAcceptedAnswerId ? (
              <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-200">
                <div className="font-semibold mb-1">Accepted answer selected</div>
                <div className="text-sm text-green-200/90">
                  This question already has an accepted answer, so new answers can’t be posted.
                  {currentUser?.id === question.author.id
                    ? " You can still change the accepted answer by selecting a different one above."
                    : ""}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <AnswerEditorSection
                  initialHtml={undefined}
                  onSubmitHtml={actions.submitAnswer}
                  isPosting={isPostingAnswer}
                />
              </div>
            )}

            <QuestionAnswersSection
              questionId={questionId}
              acceptedAnswerId={effectiveAcceptedAnswerId}
              answers={answers}
              loading={answersLoading}
              hasMore={hasMoreAnswers}
              onLoadMore={actions.loadMore}
              totalAnswers={totalAnswers}
              currentPage={currentPage}
              totalPages={totalPages}
              searchTerm={searchTerm}
              isSearching={searchTerm.length > 0}
              sortBy={sortBy}
              getVoteCount={answerVotes.getCount}
              getUserVote={answerVotes.getUserVote}
              onUpvoteAnswer={(id) => answerVotes.vote(id, 1)}
              onDownvoteAnswer={(id) => answerVotes.vote(id, -1)}
              onSearchChange={actions.changeSearch}
              onSortChange={actions.changeSort}
              onPageChange={actions.changePage}
              onAcceptAnswer={actions.acceptAnswer}
              onRemoveAcceptedAnswer={actions.removeAcceptedAnswer}
              onDeleteAnswer={actions.deleteAnswer}
              questionAskedBy={question.author.id}
              currentUserId={currentUser?.id}
            />
          </div>
        </div>

        <RelatedQuestionsSection relatedQuestions={relatedQuestions} />
      </div>
    </QnaLayout>
  );
};

export default QuestionDetailsPage;
