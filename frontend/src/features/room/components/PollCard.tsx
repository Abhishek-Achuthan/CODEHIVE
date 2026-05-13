import React from 'react';
import { BarChart2, Clock, CheckCircle2, Lock } from 'lucide-react';
import type { Poll } from '../../../shared/socket/roomTypes';
import { motion } from 'framer-motion';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionIds: string[]) => void;
  onClose: (pollId: string) => void;
  currentUserId: string;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, onClose, currentUserId }) => {
  const hasVoted = poll.options.some(opt => opt.votes.includes(currentUserId));
  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
  const isCreator = poll.createdBy === currentUserId;
  const isExpired = !!(poll.expiresAt && new Date(poll.expiresAt) < new Date());
  const isClosed = !poll.isActive || isExpired;

  const handleVote = (optionId: string) => {
    if (isClosed) return;
    
    if (poll.allowMultiple) {
      const currentVotes = poll.options
        .filter(opt => opt.votes.includes(currentUserId))
        .map(opt => opt.id!);
      
      const newVotes = currentVotes.includes(optionId)
        ? currentVotes.filter(id => id !== optionId)
        : [...currentVotes, optionId];
      
      onVote(poll.id, newVotes);
    } else {
      onVote(poll.id, [optionId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#161b22] border ${isClosed ? 'border-gray-800' : 'border-gray-700'} rounded-xl p-4 mb-4 shadow-lg group relative overflow-hidden`}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isClosed ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> Closed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full animate-pulse">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Live
            </span>
          )}
          {poll.allowMultiple && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
              Multiple Choice
            </span>
          )}
        </div>
        
        {isCreator && !isClosed && (
          <button 
            onClick={() => onClose(poll.id)}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
            title="Close Poll"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-100 mb-4 leading-relaxed">
        {poll.question}
      </h3>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const voteCount = option.votes.length;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = option.votes.includes(currentUserId);
          
          return (
            <div key={option.id} className="relative">
              <button
                disabled={isClosed}
                onClick={() => handleVote(option.id!)}
                className={`w-full relative z-10 flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500/50 bg-blue-500/5' 
                    : 'border-gray-800 hover:border-gray-700 bg-gray-900/40'
                } ${isClosed ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3 w-full pr-12">
                  <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-700'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                    {option.text}
                  </span>
                </div>
                
                {(hasVoted || isClosed) && (
                  <span className="text-xs font-mono font-bold text-gray-500">
                    {percentage}%
                  </span>
                )}
              </button>

              {/* Progress Bar Background */}
              {(hasVoted || isClosed) && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full rounded-lg transition-colors ${
                    isSelected ? 'bg-blue-500/10' : 'bg-gray-800/30'
                  }`}
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800/50 flex items-center justify-between text-[10px] text-gray-500 font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <BarChart2 className="w-3 h-3" /> {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>
          {poll.expiresAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> 
              {isClosed ? 'Ended' : `Ends ${new Date(poll.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PollCard;
