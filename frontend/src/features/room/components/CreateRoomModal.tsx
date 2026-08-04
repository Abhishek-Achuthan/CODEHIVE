import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../shared/ui/dialog/Dialog';
import { RoomService } from '../../../services/roomService';
import type { RoomVisibility } from '../../../shared/types/api/room';

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const CreateRoomModal = ({ open, onClose, onCreated }: CreateRoomModalProps) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<RoomVisibility>('PUBLIC_REQUEST');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVisibility('PUBLIC_REQUEST');
    setErrors({});
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }
    if (description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const room = await RoomService.createRoom({
        title: title.trim(),
        description: description.trim() || undefined,
        visibility,
      });
      if (room.joinUrl) {
        await navigator.clipboard.writeText(room.joinUrl);
      }
      onCreated?.();
      handleClose();
      navigate(`/room/${room.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create room. Please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Create Room
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mt-2">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="room-title" className="text-sm font-medium text-gray-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="room-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter room title"
              disabled={isLoading}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-0.5">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="room-description" className="text-sm font-medium text-gray-300">
              Description{' '}
              <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="room-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this room..."
              disabled={isLoading}
              rows={3}
              maxLength={500}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
            />
            <p className="text-gray-500 text-xs text-right">
              {description.length}/500
            </p>
            {errors.description && (
              <p className="text-red-400 text-xs">{errors.description}</p>
            )}
          </div>

          {/* Visibility */}
          <div className="flex flex-col gap-1">
            <label htmlFor="room-visibility" className="text-sm font-medium text-gray-300">
              Visibility
            </label>
            <select
              id="room-visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as RoomVisibility)}
              disabled={isLoading}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="PUBLIC_REQUEST">Public (anyone can request to join)</option>
              <option value="PRIVATE">Private — join via invite link only</option>
            </select>
          </div>

          {/* API Error */}
          {apiError && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2">
              {apiError}
            </p>
          )}

          <DialogFooter className="mt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Room'
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
