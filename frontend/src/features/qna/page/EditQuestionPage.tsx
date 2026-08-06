import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import QnaLayout from "../../../layouts/QnaLayout";
import QuestionEditor from "../components/QuestionEditor";
import { QuesDetailPageSkelton } from "../components/QuesDetailPageSkelton";
import { useQuestionFetch } from "../hooks/useQuestionFetch";
import { useEditQuestion } from "../hooks/useEditQuestion";

export default function EditQuestionPage() {
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

  const plainTextLength = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    const text = tmp.textContent || tmp.innerText || "";
    return text.trim().length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId || !question) return;

    if (formData.title.length > 200) {
      toast.error("Title cannot exceed 200 characters.");
      return;
    }

    const descLen = plainTextLength(formData.description);
    if (descLen > 2000) {
      toast.error("Description cannot exceed 2000 characters.");
      return;
    }

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

  const descLen = plainTextLength(formData.description);

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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <span className={`text-xs ${formData.title.length > 200 ? 'text-rose-400' : 'text-gray-500'}`}>
                {formData.title.length}/200
              </span>
            </div>
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <span className={`text-xs ${descLen > 2000 ? 'text-rose-400' : 'text-gray-500'}`}>
                {descLen}/2000 characters
              </span>
            </div>
            <QuestionEditor
              value={formData.description}
              onChange={(html) =>
                setFormData((p) => ({ ...p, description: html }))
              }
              placeholder="Edit your question description..."
            />
            {descLen > 2000 && (
              <p className="text-xs text-rose-400 mt-1">Exceeds limit by {descLen - 2000} characters</p>
            )}
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
                className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md ${
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
}
