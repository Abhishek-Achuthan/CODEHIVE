import React, { useState } from 'react';
import type { Participant } from '../types';
import { Users, Circle, ChevronLeft, ChevronRight, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomService } from '../../../services/roomService';

interface ParticipantsSidebarProps {
  participants: Participant[];
  roomId: string;
}

const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = ({ participants, roomId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const onlineCount = participants.filter(p => p.status === 'online').length;
  const authorization = useRoomAuthorization();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`flex flex-col h-full bg-[#0d1117] transition-all duration-300 ${
      isCollapsed ? 'w-[56px]' : 'w-[250px]'
    }`}>
      <div className={`flex items-center border-b border-gray-800 transition-all ${
        isCollapsed ? 'flex-col py-4 gap-4' : 'flex-row justify-between p-4'
      }`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <h2 className="text-sm font-semibold text-gray-100 uppercase tracking-wider truncate">
              Participants
            </h2>
          </div>
        )}

        <button
          onClick={handleToggle}
          className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-gray-100 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {!isCollapsed && (
          <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
            {onlineCount}/{participants.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center rounded-lg transition-colors group cursor-pointer ${
                isCollapsed ? 'justify-center p-1' : 'justify-between p-2'
              } ${participant.isCurrentUser ? 'bg-blue-600/10' : 'hover:bg-[#161b22]'}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full bg-gray-700 object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d1117] ${
                    participant.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className={`text-sm font-medium truncate ${
                      participant.isCurrentUser ? 'text-blue-400' : 'text-gray-300'
                    }`}>
                      {participant.name}
                    </span>
                    <span className="text-[10px] text-gray-500 leading-none capitalize">
                      {participant.status}
                    </span>
                  </div>
                )}
              </div>
              
              {!isCollapsed &&
                authorization.canModerateParticipants &&
                !participant.isCurrentUser &&
                participant.role !== 'HOST' && (
                <button
                  type="button"
                  title="Remove from room"
                  onClick={async () => {
                    try {
                      await RoomService.kickParticipant(roomId, participant.id);
                      toast.success(`${participant.name} was removed`);
                    } catch {
                      toast.error('Failed to remove participant');
                    }
                  }}
                  className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className={`p-4 border-t border-gray-800 bg-[#161b22]/30 flex items-center transition-all ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        <div className="flex items-center gap-2">
          <Circle className={`w-2 h-2 fill-green-500 text-green-500 ${isCollapsed ? '' : 'shrink-0'}`} />
          {!isCollapsed && <span className="text-xs text-gray-400 whitespace-nowrap">Stable</span>}
        </div>
      </div>
    </aside>
  );
};

export default ParticipantsSidebar;
