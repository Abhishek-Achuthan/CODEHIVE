import { useState } from 'react';
import type { CommentAPI } from '../../../shared/types/api/qna';
import { parseDate, timeAgo } from '../../../shared/utils/dateUtils';
import { CommentForm } from './CommentForm';

type Props = {
  comment: CommentAPI;
  currentUserId?: string;
  onUpdate: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

export function CommentItem({ comment, currentUserId, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === comment.author.id;

  const handleUpdate = async (content: string) => {
    await onUpdate(comment.id, content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group flex gap-3 py-2 border-b border-zinc-800/30 last:border-0 items-start">
      <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs border border-indigo-500/20 shrink-0 mt-0.5">
        {comment.author.firstName?.[0] || 'U'}
      </div>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="Save"
          />
        ) : (
          <div>
            <span className="text-xs font-medium text-indigo-400 mr-2">
              {comment.author.firstName || comment.author.username || 'Anonymous'}
            </span>
            <span className="text-sm text-zinc-300 break-words">{comment.content}</span>
            <span className="text-[11px] text-zinc-500 ml-2 whitespace-nowrap">
              {timeAgo(parseDate(comment.createdAt))}
            </span>
            
            {isOwner && (
              <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this comment?')) {
                      handleDelete();
                    }
                  }}
                  disabled={isDeleting}
                  className="text-[11px] text-rose-500/70 hover:text-rose-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
