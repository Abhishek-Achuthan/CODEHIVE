import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QnAService } from '../../../services/qnaService';
import { toast } from 'react-hot-toast';
import QuestionEditor from '../components/QuestionEditor';
import QnaLayout from '../../../layouts/QnaLayout';
import { useFetchAnswer } from '../hooks/useFetchAnswer';
import { BaseError } from '../../../shared/errors/BaseError';

const EditAnswerPage = () => {
  const { answerId } = useParams<{ answerId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [version, setVersion] = useState(1);

  const { data: answer, loading, error } = useFetchAnswer(answerId);

  useEffect(() => {
    if (answer) {
      setContent(answer.answerText);
      setVersion(answer.version);
    }
  }, [answer]);

  if (loading) {
    return (
      <QnaLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading answer...</div>
        </div>
      </QnaLayout>
    );
  }

  if (error) {
    toast.error('Failed to load answer');
    return (
      <QnaLayout>
        <div className="text-red-500 p-4">Error loading answer: {error.message}</div>
      </QnaLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerId) return;

    try {
      setIsSubmitting(true);
      await QnAService.editAnswer({
        answerId,
        answerText: content,
        version: version
      });
      toast.success('Answer updated');
      navigate(-1);
    } catch (error) {
      if(error instanceof BaseError) {
        toast.error(error.message || 'Failed to update answer');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QnaLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Answer</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            ← Back to Question
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-900/30 p-6 rounded-lg border border-gray-800/50">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Answer
              </label>
              <QuestionEditor
                value={content}
                onChange={setContent}
                placeholder="Edit your answer..."
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Changes are visible to everyone
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
                  className={`px-6 py-2 bg-linear-to-r from-purple-600 to-blue-500 text-white rounded-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </QnaLayout>
  );
};

export default EditAnswerPage;