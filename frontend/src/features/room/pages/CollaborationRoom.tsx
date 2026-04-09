import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoomSocket } from '../../../shared/socket/useRoomSocket';
import { useAppSelector } from '../../../shared/hooks/storeHooks';
import type { RoomMessage, Participant, ParticipantStatus } from '../types';
import TopBar from '../components/TopBar';
import ParticipantsSidebar from '../components/ParticipantsSidebar';
import EditorArea from '../components/EditorArea';
import RightSidebar from '../components/RightSidebar';
import { Loader2, AlertCircle } from 'lucide-react';

const CollaborationRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const leaveRoomRef = useRef<() => void>(() => {});
  
  const { 
    messages: socketMessages, 
    participants: socketParticipants, 
    sendMessage, 
    emitTyping,
    leaveRoom,
    typingUsers,
    isJoined, 
    error 
  } = useRoomSocket(roomId || null);

  const roomName = "Project Collaboration Room";

  useEffect(() => {
    leaveRoomRef.current = leaveRoom;
  }, [leaveRoom]);

  useEffect(() => {
    return () => {
      leaveRoomRef.current();
    };
  }, []);

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/rooms');
  };

  const currentUser: Participant | null = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      status: 'online' as ParticipantStatus,
      isCurrentUser: true,
    };
  }, [user]);

  // Map socket messages to UI format
  const formattedMessages: RoomMessage[] = useMemo(() => {
    if (!user) return [];
    return socketMessages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName: msg.senderName || (msg.senderId === user.id ? `${user.firstName} ${user.lastName}` : 'User'),
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  }, [socketMessages, user]);

  // Map socket participants to UI format
  const formattedParticipants: Participant[] = useMemo(() => {
    if (!user) return [];
    const list = socketParticipants.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
      status: p.status as ParticipantStatus,
      isCurrentUser: !!(p.id === user.id),
    }));

    // If current user is not in the list but we are joined, add them
    if (isJoined && currentUser && !list.find(p => p.id === currentUser.id)) {
      list.push({
        ...currentUser,
        isCurrentUser: true,
      });
    }
    
    return list;
  }, [socketParticipants, user, isJoined, currentUser]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#010409] text-gray-300">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-bold mb-2">Unable to join room</h1>
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

  if (!isJoined || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#010409] text-gray-300">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium animate-pulse">Joining collaboration room...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#010409] text-gray-300 font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Navigation */}
      <TopBar roomName={roomName} onLeave={handleLeaveRoom} />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Participants */}
        <ParticipantsSidebar participants={formattedParticipants} />

        {/* Center Main: Editor Area */}
        <EditorArea />

        {/* Right Sidebar: Chat & Tabs */}
        <RightSidebar
          messages={formattedMessages}
          onSendMessage={sendMessage}
          onTypingChange={emitTyping}
          typingUsers={typingUsers}
          currentUser={currentUser}
        />
      </div>
      
      {/* Global CSS for scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
      `}</style>
    </div>
  );
};

export default CollaborationRoom;
