import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRoomSocket } from '../../../shared/socket/useRoomSocket';
import { useAppSelector } from '../../../shared/hooks/storeHooks';
import { RoomService } from '../../../services/roomService';
import { BaseError } from '../../../shared/errors/BaseError';
import { useSocket } from '../../../shared/socket/useSocket';
import { useRoomSocketEvent } from '../../../shared/socket/roomSocketEvents';
import type { RoomSocket } from '../../../shared/socket/roomTypes';

import type {
  RoomMessage,
  Participant,
  ParticipantStatus,
} from '../types';
import { RoomAuthorizationProvider } from '../authorization/RoomAuthorizationContext';

import TopBar from '../components/TopBar';
import ParticipantsSidebar from '../components/ParticipantsSidebar';
import EditorArea from '../components/EditorArea';
import RightSidebar from '../components/RightSidebar';
import { RoomSettingsModal } from '../components/RoomSettingsModal';
import { EndRoomDialog } from '../components/EndRoomDialog';

import { Loader2, AlertCircle } from 'lucide-react';
import { getLifecycleBannerMessage } from '../authorization/lifecycleMessages';

const CollaborationRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const { socket } = useSocket();
  const roomSocket = socket as RoomSocket | null;

  const {
    snapshot,
    authorization,
    messages: socketMessages,
    participants: socketParticipants,
    sendMessage,
    editMessage,
    deleteMessage,
    polls,
    createPoll,
    votePoll,
    closePoll,
    emitTyping,
    leaveRoom,
    refreshRoom,
    typingUsers,
    hasRoomSnapshot,
    isRealtimeReady,
    error,
  } = useRoomSocket(roomId || null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [endRoomOpen, setEndRoomOpen] = useState(false);
  const [endRoomLoading, setEndRoomLoading] = useState(false);

  const roomName = 'Project Collaboration Room';

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/rooms');
  };

  useRoomSocketEvent(
    roomSocket,
    'room:participant-removed',
    (payload) => {
      if (user && payload.userId === user.id && payload.roomId === roomId) {
        toast.error('You have been removed from the room.');
        leaveRoom();
        navigate('/rooms');
      }
    }
  );

  const handleConfirmEndRoom = async () => {
    if (!roomId) return;

    setEndRoomLoading(true);
    try {
      await RoomService.endRoom(roomId);
      await refreshRoom();
      setEndRoomOpen(false);
      toast.success('Room ended');
    } catch (err) {
      const message = err instanceof BaseError ? err.message : 'Failed to end room';
      toast.error(message);
    } finally {
      setEndRoomLoading(false);
    }
  };

  // Current user
  const currentUser: Participant | null = useMemo(() => {
    if (!user) return null;

    // Try to find the user's role in the snapshot first
    const snapshotParticipant = hasRoomSnapshot 
      ? socketParticipants.find(p => p.id === user.id) 
      : null;

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar:
        user.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      status: 'online' as ParticipantStatus,
      role: snapshotParticipant?.role || 'PARTICIPANT',
      isCurrentUser: true,
    };
  }, [user, hasRoomSnapshot, socketParticipants]);

  // Messages
  const formattedMessages: RoomMessage[] = useMemo(() => {
    if (!user) return [];

    return socketMessages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName:
        msg.senderName ||
        (msg.senderId === user.id
          ? `${user.firstName} ${user.lastName}`
          : 'User'),
      parentMessageId: msg.parentMessageId,
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isDeleted: msg.isDeleted,
      isEdited: msg.isEdited,
    }));
  }, [socketMessages, user]);

  // Participants
  const formattedParticipants: Participant[] = useMemo(() => {
    if (!user) return [];

    const list: Participant[] = socketParticipants.map((p) => ({
      id: p.id,
      name: p.name,
      avatar:
        p.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
      status: p.status as ParticipantStatus,
      role: p.role || 'PARTICIPANT',
      isCurrentUser: p.id === user.id,
    }));

    // Ensure current user exists in participants
    if (
      hasRoomSnapshot &&
      currentUser &&
      !list.find((p) => p.id === currentUser.id)
    ) {
      list.push({
        ...currentUser,
        isCurrentUser: true,
      });
    }

    return list;
  }, [socketParticipants, user, hasRoomSnapshot, currentUser]);

  // FINAL CURRENT USER
  // IMPORTANT: Hook MUST be above conditional returns
  const finalCurrentUser = useMemo(() => {
    if (!currentUser) return null;

    return (
      formattedParticipants.find((p) => p.id === user?.id) || currentUser
    );
  }, [formattedParticipants, user, currentUser]);

  const canEndRoom =
    authorization.isActive && finalCurrentUser?.role === 'HOST';

  const lifecycleBanner = getLifecycleBannerMessage(authorization);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#010409] text-gray-300">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />

        <h1 className="text-xl font-bold mb-2">
          Unable to join room
        </h1>

        <p className="text-gray-500">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (!hasRoomSnapshot || !currentUser || !finalCurrentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#010409] text-gray-300">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />

        <p className="text-gray-400 font-medium animate-pulse">
          Joining collaboration room...
        </p>
      </div>
    );
  }

  return (
    <RoomAuthorizationProvider snapshot={snapshot}>
      <div className="flex flex-col h-screen w-full bg-[#010409] text-gray-300 font-sans selection:bg-blue-600/30 selection:text-blue-200">
        {/* Top Bar */}
        <TopBar
          roomName={roomName}
          roomId={roomId!}
          showInviteControls={authorization.canManageRoomPermissions}
          showEndRoomControl={canEndRoom}
          onOpenSettings={() => setSettingsOpen(true)}
          onEndRoom={() => setEndRoomOpen(true)}
          onLeave={handleLeaveRoom}
        />

        <RoomSettingsModal
          roomId={roomId!}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />

        <EndRoomDialog
          open={endRoomOpen}
          loading={endRoomLoading}
          onConfirm={handleConfirmEndRoom}
          onClose={() => setEndRoomOpen(false)}
        />

        {lifecycleBanner && (
          <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
            {lifecycleBanner}
          </div>
        )}

        {/* Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Participants */}
          <ParticipantsSidebar
            participants={formattedParticipants}
            roomId={roomId!}
          />

          {/* Editor */}
          <EditorArea roomId={roomId || ''} />

          {/* Right Sidebar */}
          <RightSidebar
            messages={formattedMessages}
            onSendMessage={sendMessage}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
            onTypingChange={emitTyping}
            typingUsers={typingUsers}
            currentUser={finalCurrentUser}
            isRealtimeReady={isRealtimeReady}
            polls={polls}
            onCreatePoll={createPoll}
            onVotePoll={votePoll}
            onClosePoll={closePoll}
            roomId={roomId || ''}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
      </div>
    </RoomAuthorizationProvider>
  );
};

export default CollaborationRoom;
