import React, { useState } from 'react';
import type { Participant } from '../types';
import { Users, Circle, ChevronLeft, ChevronRight, UserMinus, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomService } from '../../../services/roomService';
import ParticipantPermissionsPanel from './ParticipantPermissionsPanel';
import ReportParticipantModal from './ReportParticipantModal';
import { Flag } from 'lucide-react';

interface ParticipantsSidebarProps {
  participants: Participant[];
  roomId: string;
}

const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = ({ participants, roomId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openPermissionsFor, setOpenPermissionsFor] = useState<string | null>(null);
  const [participantOverrides, setParticipantOverrides] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [reportingParticipant, setReportingParticipant] = useState<{ id: string; name: string } | null>(null);

  const onlineCount = participants.filter(p => p.status === 'online').length;
  const authorization = useRoomAuthorization();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePermissionsClick = (participantId: string) => {
    setOpenPermissionsFor((current) =>
      current === participantId ? null : participantId,
    );
  };

  const handleOverridesUpdated = (
    participantId: string,
    overrides: Record<string, boolean>,
  ) => {
    setParticipantOverrides((current) => ({
      ...current,
      [participantId]: overrides,
    }));
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
        <div className="space-y-1">
          {participants.map((participant) => {
            const isPermissionsPanelOpen = openPermissionsFor === participant.id;
            const canManageThisParticipant =
              !isCollapsed &&
              authorization.canManageRoomPermissions &&
              !participant.isCurrentUser &&
              participant.role !== 'HOST';

            const canReportThisParticipant =
              !isCollapsed &&
              !participant.isCurrentUser;

            return (
              <div key={participant.id}>
                {/* Participant row */}
                <div
                  className={`flex items-center rounded-lg transition-colors group cursor-pointer ${
                    isCollapsed ? 'justify-center p-1' : 'justify-between p-2'
                  } ${
                    participant.isCurrentUser
                      ? 'bg-blue-600/10'
                      : isPermissionsPanelOpen
                        ? 'bg-[#1c2128]'
                        : 'hover:bg-[#161b22]'
                  }`}
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
                          {participant.role === 'HOST' ? 'host' : participant.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {((canManageThisParticipant) || (canReportThisParticipant)) && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Permission management toggle */}
                      {canManageThisParticipant && (
                      <button
                        type="button"
                        title="Manage permissions"
                        onClick={() => handlePermissionsClick(participant.id)}
                        className={`p-1 rounded transition-colors ${
                          isPermissionsPanelOpen
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-gray-600 hover:text-blue-400 hover:bg-blue-500/10'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                      )}

                      {/* Report button */}
                      {canReportThisParticipant && (
                        <button
                          type="button"
                          title="Report participant"
                          onClick={() => setReportingParticipant({ id: participant.id, name: participant.name })}
                          className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Kick button */}
                      {authorization.canModerateParticipants && (
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
                          className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Inline permissions panel — slides open below the participant row */}
                {isPermissionsPanelOpen && canManageThisParticipant && (
                  <ParticipantPermissionsPanel
                    roomId={roomId}
                    participantId={participant.id}
                    participantName={participant.name}
                    initialOverrides={participantOverrides[participant.id] ?? {}}
                    onOverridesUpdated={(overrides) =>
                      handleOverridesUpdated(participant.id, overrides)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {reportingParticipant && (
        <ReportParticipantModal
          isOpen={!!reportingParticipant}
          onClose={() => setReportingParticipant(null)}
          roomId={roomId}
          participantId={reportingParticipant.id}
          participantName={reportingParticipant.name}
        />
      )}

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
