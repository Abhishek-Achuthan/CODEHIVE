import { useState, useRef, useEffect } from 'react';

type Props = {
  initialValue?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  placeholder?: string;
};

export function CommentForm({ initialValue = '', onSubmit, onCancel, submitLabel = 'Post', placeholder = 'Write a comment...' }: Props) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSubmitting}
        rows={1}
        className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-500 resize-none outline-none overflow-hidden"
      />
      <div className="flex items-center justify-end gap-2 mt-2">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-xs px-3 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="text-xs px-3 py-1.5 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : submitLabel}
        </button>
      </div>
    </div>
  );
}
