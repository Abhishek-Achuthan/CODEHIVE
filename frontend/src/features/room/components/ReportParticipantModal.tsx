import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../shared/ui/dialog/Dialog';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { RoomService } from '../../../services/roomService';

interface ReportParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  participantId: string;
  participantName: string;
}

const ReportParticipantModal: React.FC<ReportParticipantModalProps> = ({
  isOpen,
  onClose,
  roomId,
  participantId,
  participantName,
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for the report');
      return;
    }

    setIsLoading(true);

    try {
      await RoomService.reportParticipant(roomId, participantId, reason.trim(), description.trim() || undefined);
      toast.success('Report submitted successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0d1117] border-gray-800 text-white max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="bg-[#161b22] px-6 py-4 border-b border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" /> Report Participant
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-sm text-gray-300">
            You are reporting <span className="font-bold text-white">{participantName}</span>. This report will be reviewed by the moderators.
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#161b22] border border-gray-800 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="" disabled>Select a reason...</option>
              <option value="SPAM">Spam or unwanted advertising</option>
              <option value="HARASSMENT">Harassment or bullying</option>
              <option value="INAPPROPRIATE_CONTENT">Inappropriate content or behavior</option>
              <option value="DISRUPTIVE">Disruptive to the room</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide any additional details..."
              className="w-full bg-[#161b22] border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none h-24"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-gray-400 hover:text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason}
              className="flex-[1.5] bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white py-2.5 px-4 text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-900/20"
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportParticipantModal;
