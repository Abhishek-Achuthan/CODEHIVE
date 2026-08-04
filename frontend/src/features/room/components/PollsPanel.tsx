import React, { useState, useEffect } from 'react';
import { Plus, BarChart2, History, Loader2 } from 'lucide-react';
import type {  Participant } from '../types';
import type { CreatePollRequest } from '../../../shared/types/api/room';
import type { Poll as SocketPoll } from '../../../shared/socket/roomTypes';
import PollCard from './PollCard';
import CreatePollModal from './CreatePollModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomService } from '../../../services/roomService';
import toast from 'react-hot-toast';

interface PollsPanelProps {
  roomId: string;
  polls: SocketPoll[];
  onCreatePoll: (poll: CreatePollRequest) => void;
  onVotePoll: (pollId: string, optionIds: string[]) => void;
  onClosePoll: (pollId: string) => void;
  currentUser: Participant;
}

const PollsPanel: React.FC<PollsPanelProps> = ({
  roomId,
  polls,
  onCreatePoll,
  onVotePoll,
  onClosePoll,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'active' | 'closed'>('active');
  const [fetchedClosedPolls, setFetchedClosedPolls] = useState<SocketPoll[]>([]);
  const [isLoadingClosed, setIsLoadingClosed] = useState(false);
  const authorization = useRoomAuthorization();

  useEffect(() => {
    if (filter === 'closed') {
      setIsLoadingClosed(true);
      RoomService.getClosedPoll(roomId)
        .then((data) => {
          setFetchedClosedPolls(data);
        })
        .catch((err) => {
          console.error(err);
          toast.error('Failed to load closed polls');
        })
        .finally(() => {
          setIsLoadingClosed(false);
        });
    }
  }, [filter, roomId]);

  const activePolls = polls.filter(p => p.isActive && (!p.expiresAt || new Date(p.expiresAt) > new Date()));
  const localClosedPolls = polls.filter(p => !p.isActive || (p.expiresAt && new Date(p.expiresAt) <= new Date()));

  const allClosedPollsMap = new Map<string, SocketPoll>();
  fetchedClosedPolls.forEach(p => allClosedPollsMap.set(p.id, p));
  localClosedPolls.forEach(p => allClosedPollsMap.set(p.id, p));

  const combinedClosedPolls = Array.from(allClosedPollsMap.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const currentPolls = filter === 'active' ? activePolls : combinedClosedPolls;

  const canCreate = authorization.canCreatePolls;

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('active')}
            className={`text-xs font-bold uppercase tracking-widest transition-all ${
              filter === 'active' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Active ({activePolls.length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              filter === 'closed' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Closed ({combinedClosedPolls.length})
          </button>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
            title="Create Poll"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filter === 'closed' && isLoadingClosed && fetchedClosedPolls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full space-y-4"
            >
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Loading closed polls...</p>
            </motion.div>
          ) : currentPolls.length > 0 ? (
            currentPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={onVotePoll}
                onClose={onClosePoll}
                currentUserId={currentUser.id}
                canVote={authorization.canVotePolls}
                canClose={authorization.canClosePolls}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4"
            >
              <div className="w-16 h-16 bg-[#161b22] rounded-full flex items-center justify-center">
                {filter === 'active' ? (
                  <BarChart2 className="w-8 h-8 text-gray-700" />
                ) : (
                  <History className="w-8 h-8 text-gray-700" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300">
                  {filter === 'active' ? 'No active polls' : 'No closed polls'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {filter === 'active' 
                    ? 'New polls will appear here as they are created.' 
                    : 'Historical polls will be archived here.'}
                </p>
              </div>
              {canCreate && filter === 'active' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-[#161b22] hover:bg-[#1c2128] border border-gray-800 text-xs font-bold text-gray-300 rounded-xl transition-all"
                >
                  Create First Poll
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreatePollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onCreatePoll}
      />
    </div>
  );
};

export default PollsPanel;
