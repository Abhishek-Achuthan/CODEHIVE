import { useParams } from "react-router-dom";
import QnaLayout from "../../../layouts/QnaLayout";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { QuestionHeaderSection } from "../components/QuestionDetailsHeaderSection";
import { RelatedQuestionsSection } from "../components/RelatetdQuestionSection";
import AnswerEditorSection from "../components/AnswerEditorSection";
import { QuestionAnswersSection } from "../components/QuestionAnswersSection";
import { useQuestionDetails } from "../hooks/useQuestionDetails";

const QuestionDetailsPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();

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
    isPostingAnswer
  } = controller

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
              onUpvote={ () => questionVote.vote(1)}
              onDownvote={() => questionVote.vote(-1)}
            />

            <QuestionAnswersSection
              answers={answers}
              loading={answersLoading}
              totalAnswers={totalAnswers}
              currentPage={currentPage}
              totalPages={totalPages}
              searchTerm={searchTerm}
              isSearching={searchTerm.length > 0}
              sortBy={sortBy}
              getVoteCount={answerVotes.getCount}
              getUserVote={answerVotes.getUserVote}
              onUpvoteAnswer={(id) => answerVotes.vote(id,1)}
              onDownvoteAnswer={(id) => answerVotes.vote(id,-1)} 
              onSearchChange={actions.changeSearch}
              onSortChange={actions.changeSort}
              onPageChange={actions.changePage}
            />

            <AnswerEditorSection
              initialHtml={undefined}
              onSubmitHtml={actions.submitAnswer}
              isPosting={isPostingAnswer}
            />
          </div>
        </div>

        <RelatedQuestionsSection relatedQuestions={relatedQuestions} />
      </div>
    </QnaLayout>
  );
};

export default QuestionDetailsPage;
