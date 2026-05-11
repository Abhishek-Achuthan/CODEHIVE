import React, { useState } from 'react';
import { Plus, BarChart2, Inbox, History } from 'lucide-react';
import type {  Participant } from '../types';
import type { CreatePollRequest } from '../../../shared/types/api/room';
import type { Poll as SocketPoll } from '../../../shared/socket/roomTypes';
import PollCard from './PollCard';
import CreatePollModal from './CreatePollModal';
import { motion, AnimatePresence } from 'framer-motion';

interface PollsPanelProps {
  polls: SocketPoll[];
  onCreatePoll: (poll: CreatePollRequest) => void;
  onVotePoll: (pollId: string, optionIds: string[]) => void;
  onClosePoll: (pollId: string) => void;
  currentUser: Participant;
}

const PollsPanel: React.FC<PollsPanelProps> = ({
  polls,
  onCreatePoll,
  onVotePoll,
  onClosePoll,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'active' | 'closed'>('active');

  const activePolls = polls.filter(p => p.isActive && (!p.expiresAt || new Date(p.expiresAt) > new Date()));
  const closedPolls = polls.filter(p => !p.isActive || (p.expiresAt && new Date(p.expiresAt) <= new Date()));

  const currentPolls = filter === 'active' ? activePolls : closedPolls;

  const role = currentUser.role?.toUpperCase();
  const canCreate = role === 'MENTOR' || role === 'HOST' || role === 'PARTICIPANT';

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
            className={`text-xs font-bold uppercase tracking-widest transition-all ${
              filter === 'closed' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Closed ({closedPolls.length})
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
          {currentPolls.length > 0 ? (
            currentPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={onVotePoll}
                onClose={onClosePoll}
                currentUserId={currentUser.id}
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
