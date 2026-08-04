import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import QnaLayout from "../../../layouts/QnaLayout";
import QuestionEditor from "../components/QuestionEditor";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { useQuestionFetch } from "../hooks/useQuestionFetch";
import { useEditQuestion } from "../hooks/useEditQuestion";

const EditQuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { loading, question } = useQuestionFetch(questionId);
  const { editQuestion } = useEditQuestion();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        description: question.contentHtml || "",
      });
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId || !question) return;

    try {
      setIsSubmitting(true);

      const ok = await editQuestion({
        questionId,
        title: formData.title,
        contentHtml: formData.description,
        tags: question.tags,
        version: question.version ?? 1,
      });

      if (ok) navigate(`/qna/question/${questionId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <QnaLayout title="Edit Question">
        <QuesDetailPageSkelton />
      </QnaLayout>
    );
  }

  if (!question) {
    return (
      <QnaLayout title="Edit Question">
        <div className="text-gray-400">Question not found.</div>
      </QnaLayout>
    );
  }

  return (
    <QnaLayout title="Edit Question">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end items-center mb-8">
          <button
            onClick={() => navigate(`/qna/question/${questionId}`)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            ← Back to Question
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-900/30 p-6 rounded-lg border border-gray-800/50"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              required
              minLength={10}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <QuestionEditor
              value={formData.description}
              onChange={(html) =>
                setFormData((p) => ({ ...p, description: html }))
              }
              placeholder="Edit your question description..."
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <span className="text-sm text-gray-400">
              Your changes will be visible to others
            </span>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-linear-to-r from-purple-600 to-blue-500 text-white rounded-md ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </QnaLayout>
  );
};

export default EditQuestionPage;
