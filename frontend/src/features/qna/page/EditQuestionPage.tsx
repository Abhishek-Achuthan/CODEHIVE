import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import QuestionEditor from "../components/QuestionEditor";
import QnaLayout from "../../../layouts/QnaLayout";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { useFetchQuestion } from "../hooks/useFetchQuestion";

const EditQuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { data: questionData, loading } = useFetchQuestion(questionId);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questionData?.question) {
      setFormData({
        title: questionData.question.title,
        description: questionData.question.descriptionHtml || ""
      });
    }
  }, [questionData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId || !questionData) return;

    try {
      setIsSubmitting(true);
      await QnAService.editQuestion({
        questionId,
        title: formData.title,
        descriptionHtml: formData.description,
        askedBy: questionData.question.askedBy,
        tags: questionData.question.tags,
        version: questionData.question.version || 1,
      });
      toast.success("Question updated successfully");
      navigate(`/qna/question/${questionId}`);
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else toast.error("Failed to update question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <QuesDetailPageSkelton />;
  if (!questionData) return <div>Question not found</div>;

  return (
    <QnaLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Question</h1>
          <button
            onClick={() => navigate(`/qna/question/${questionId}`)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            ← Back to Question
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/30 p-6 rounded-lg border border-gray-800/50">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={10}
              maxLength={200}
              placeholder="Edit your question title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
              <span className="ml-2 text-xs text-gray-500">(Editing existing content)</span>
            </label>
            <QuestionEditor
              value={formData.description}
              onChange={(html) => setFormData(p => ({ ...p, description: html }))}
              placeholder="Edit your question description..."
            />
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Tip: Your changes will be clearly visible to others
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-linear-to-r from-purple-600 to-blue-500 text-white rounded-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </QnaLayout>
  );
};

export default EditQuestionPage;