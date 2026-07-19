import { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string) => Promise<void>;
  loading?: boolean;
}

export function ReviewModal({ open, onClose, onSubmit, loading }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    await onSubmit(rating, reviewText);
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#111214] border border-white/10 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Rate Your Session</h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Stars */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={loading}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Share your experience (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={loading}
                placeholder="What did you like about this session?"
                className="w-full h-28 p-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-black/20 border-t border-white/5">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[100px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
}
