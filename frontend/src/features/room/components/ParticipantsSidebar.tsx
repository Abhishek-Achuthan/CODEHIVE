import React, { useState } from 'react';
import type { Participant } from '../types';
import { Users, Circle, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomService } from '../../../services/roomService';
import ParticipantManagementPopover from './ParticipantManagementPopover';
import ReportParticipantModal from './ReportParticipantModal';

interface ParticipantsSidebarProps {
  participants: Participant[];
  roomId: string;
}

const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = ({ participants, roomId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [managingParticipant, setManagingParticipant] = useState<Participant | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [participantOverrides, setParticipantOverrides] = useState<Record<string, Record<string, boolean>>>({});
  const [reportingParticipant, setReportingParticipant] = useState<{ id: string; name: string } | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

  const onlineCount = participants.filter(p => p.status === 'online').length;
  const authorization = useRoomAuthorization();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
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

  const kickParticipant = async (participantId: string, name: string) => {
    try {
      await RoomService.kickParticipant(roomId, participantId);
      toast.success(`${name} was removed`);
      if (managingParticipant?.id === participantId) {
        setManagingParticipant(null);
        setAnchorRect(null);
      }
    } catch {
      toast.error('Failed to remove participant');
    }
  };

  const handleOpenPopover = (e: React.MouseEvent, participant: Participant) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (managingParticipant?.id === participant.id) {
      setManagingParticipant(null);
      setAnchorRect(null);
    } else {
      setManagingParticipant(participant);
      setAnchorRect(rect);
      setSelectedParticipantId(participant.id);
    }
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    // Pin host to the top
    if (a.role === 'HOST' && b.role !== 'HOST') return -1;
    if (b.role === 'HOST' && a.role !== 'HOST') return 1;
    // Pin current user second
    if (a.isCurrentUser && !b.isCurrentUser) return -1;
    if (b.isCurrentUser && !a.isCurrentUser) return 1;
    // Alphabetical for the rest
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <aside className={`flex flex-col h-full bg-[#0d1117] transition-all duration-300 relative ${
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
            {sortedParticipants.map((participant) => {
              const isSelected = selectedParticipantId === participant.id || managingParticipant?.id === participant.id;
              
              const canManageThisParticipant =
                !isCollapsed &&
                authorization.canManageRoomPermissions &&
                !participant.isCurrentUser &&
                participant.role !== 'HOST';

              const canReportThisParticipant =
                !isCollapsed &&
                !participant.isCurrentUser;

              return (
                <div key={participant.id} className="relative">
                  {/* Participant row */}
                  <div
                    onClick={() => setSelectedParticipantId(participant.id)}
                    className={`flex items-center rounded-lg transition-colors group cursor-pointer ${
                      isCollapsed ? 'justify-center p-1' : 'justify-between p-2'
                    } ${
                      participant.isCurrentUser
                        ? 'bg-blue-600/10'
                        : isSelected
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

                    {/* 3-dot Action Menu Trigger */}
                    {((canManageThisParticipant) || (canReportThisParticipant)) && !isCollapsed && (
                      <button
                        type="button"
                        data-participant-trigger="true"
                        onClick={(e) => handleOpenPopover(e, participant)}
                        className={`p-1.5 rounded-md transition-colors ${managingParticipant?.id === participant.id ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800 opacity-0 group-hover:opacity-100'}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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

      <ParticipantManagementPopover
        isOpen={managingParticipant !== null}
        onClose={() => {
          setManagingParticipant(null);
          setAnchorRect(null);
        }}
        anchorRect={anchorRect}
        roomId={roomId}
        participant={managingParticipant}
        initialOverrides={managingParticipant ? (participantOverrides[managingParticipant.id] ?? {}) : {}}
        onOverridesUpdated={handleOverridesUpdated}
        onReport={() => {
          if (managingParticipant) {
            setReportingParticipant({ id: managingParticipant.id, name: managingParticipant.name });
          }
        }}
        onKick={() => {
          if (managingParticipant) {
            kickParticipant(managingParticipant.id, managingParticipant.name);
          }
        }}
        canKick={authorization.canModerateParticipants}
        canManagePermissions={
          authorization.canManageRoomPermissions &&
          managingParticipant?.role !== 'HOST' &&
          !managingParticipant?.isCurrentUser
        }
      />

      {reportingParticipant && (
        <ReportParticipantModal
          isOpen={!!reportingParticipant}
          onClose={() => setReportingParticipant(null)}
          roomId={roomId}
          participantId={reportingParticipant.id}
          participantName={reportingParticipant.name}
        />
      )}
    </>
  );
};

export default ParticipantsSidebar;
