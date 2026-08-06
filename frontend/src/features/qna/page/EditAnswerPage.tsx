import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import QnaLayout from "../../../layouts/QnaLayout";
import QuestionEditor from "../components/QuestionEditor";
import { useFetchAnswer } from "../hooks/useFetchAnswer";
import { useEditAnswer } from "../hooks/useEditAnswer";

const EditAnswerPage = () => {
  const { answerId } = useParams<{ answerId: string }>();
  const navigate = useNavigate();

  const { editAnswer } = useEditAnswer();

  const { data: answer, loading, error } = useFetchAnswer(answerId);

  const [content, setContent] = useState("");
  const [version, setVersion] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (answer) {
      setContent(answer.answerText);
      setVersion(answer.version);
    }
  }, [answer]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load answer");
    }
  }, [error]);

  const plainTextLength = (html: string): number => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    const text = tmp.textContent || tmp.innerText || "";
    return text.trim().length;
  };

  const currentLen = plainTextLength(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerId) return;

    if (currentLen < 10) {
      toast.error("Answer must contain at least 10 characters.");
      return;
    }

    if (currentLen > 2000) {
      toast.error("Answer must not exceed 2,000 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      const ok = await editAnswer({
        answerId,
        answerText: content,
        version,
      });

      if (ok) navigate(-1);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <QnaLayout title="Edit Answer">
        <div className="flex justify-center items-center h-64 text-gray-400">
          Loading answer…
        </div>
      </QnaLayout>
    );
  }

  if (!answer) {
    return (
      <QnaLayout title="Edit Answer">
        <div className="text-gray-400">Answer not found.</div>
      </QnaLayout>
    );
  }

  return (
    <QnaLayout title="Edit Answer">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Edit Answer</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            ← Back
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/30 p-6 rounded-lg border border-gray-800/50"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Your Answer
              </label>
              <span className={`text-xs ${currentLen > 2000 ? 'text-rose-400 font-medium' : 'text-gray-500'}`}>
                {currentLen}/2000 characters
              </span>
            </div>
            <QuestionEditor
              value={content}
              onChange={setContent}
              placeholder="Edit your answer…"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <span className="text-sm text-gray-400">
              Changes are visible to everyone
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
                disabled={isSubmitting || currentLen > 2000}
                className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md ${
                  isSubmitting || currentLen > 2000 ? "opacity-70 cursor-not-allowed" : ""
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

export default EditAnswerPage;
