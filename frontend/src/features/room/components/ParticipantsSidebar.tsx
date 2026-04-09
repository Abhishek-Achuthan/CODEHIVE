
import React from 'react';
import type { Participant } from '../types';
import { Users, MoreVertical, Circle } from 'lucide-react';

interface ParticipantsSidebarProps {
  participants: Participant[];
}

const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = ({ participants }) => {
  const onlineCount = participants.filter(p => p.status === 'online').length;

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0d1117] flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-gray-100 uppercase tracking-wider">Participants</h2>
        </div>
        <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
          {onlineCount}/{participants.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors group cursor-pointer ${
                participant.isCurrentUser ? 'bg-blue-600/10' : 'hover:bg-[#161b22]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full bg-gray-700"
                  />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d1117] ${
                    participant.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    participant.isCurrentUser ? 'text-blue-400' : 'text-gray-300'
                  }`}>
                    {participant.name}
                    {participant.isCurrentUser && (
                      <span className="ml-1.5 text-[10px] text-blue-500 font-normal opacity-80">(You)</span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-none capitalize">
                    {participant.status}
                  </span>
                </div>
              </div>
              
              <button className="p-1 text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-[#161b22]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span className="text-xs text-gray-400">Collaboration Status</span>
          </div>
          <span className="text-xs text-green-500 font-medium">Stable</span>
        </div>
      </div>
    </aside>
  );
};

export default ParticipantsSidebar;
