import { useState } from 'react';
import type { CommentAPI } from '../../../shared/types/api/qna';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { getComments, createComment, updateComment, deleteComment } from '../../../api/endpoints/qnaAPI';
import toast from 'react-hot-toast';

type Props = {
  answerId: string;
  currentUserId?: string;
};

export function CommentSection({ answerId, currentUserId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<CommentAPI[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await getComments(answerId);
      if (response.data?.success) {
        setComments(response.data.data);
        setCommentCount(response.data.data.length);
      }
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpen = () => {
    if (!isOpen && comments === null) {
      fetchComments();
    }
    setIsOpen(!isOpen);
  };

  const handleCreate = async (content: string) => {
    try {
      const res = await createComment(answerId, content);
      if (res.data?.success) {
        const newComment = res.data.data;
        setComments((prev) => (prev ? [...prev, newComment] : [newComment]));
        setCommentCount((prev) => prev + 1);
        toast.success('Comment added');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdate = async (commentId: string, content: string) => {
    try {
      const res = await updateComment(commentId, content);
      if (res.data?.success) {
        const updatedComment = res.data.data;
        setComments((prev) => 
          prev ? prev.map((c) => (c.id === commentId ? { ...c, content: updatedComment.content } : c)) : null
        );
        toast.success('Comment updated');
      }
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev ? prev.filter((c) => c.id !== commentId) : null);
      setCommentCount((prev) => Math.max(0, prev - 1));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800/80">
      <button
        onClick={toggleOpen}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {commentCount > 0 ? (isOpen ? 'Hide comments' : `View ${commentCount} comment${commentCount > 1 ? 's' : ''}`) : (isOpen ? 'Hide comments' : 'Add a comment')}
      </button>

      {isOpen && (
        <div className="mt-4 ml-6 pl-4 border-l-2 border-zinc-800/50">
          {isLoading ? (
            <div className="py-4 text-xs text-zinc-500">Loading comments...</div>
          ) : (
            <div className="space-y-1 mb-4">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="py-2 text-xs text-zinc-500">No comments yet. Be the first to comment.</div>
              )}
            </div>
          )}

          {currentUserId && (
            <CommentForm onSubmit={handleCreate} placeholder="Write a comment..." />
          )}
        </div>
      )}
    </div>
  );
}
