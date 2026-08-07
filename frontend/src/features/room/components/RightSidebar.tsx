import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, StickyNote, BarChart2,
  ChevronRight, ChevronLeft, Lock, PictureInPicture2
} from 'lucide-react';
import type { TabType, RoomMessage as Message, Participant } from '../types';
import ChatPanel from './ChatPanel';
import PollsPanel from './PollsPanel';
import NotesPanel from './notes/NotesPanel';
import { FeatureLockedPanel } from './FeatureLockedPanel';
import { VideoMeeting } from '../../video';
import { Video } from 'lucide-react';
import type { Poll } from '../../../shared/socket/roomTypes';
import type { CreatePollRequest } from '../../../shared/types/api/room';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import type IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import {
  getFeatureLockReason,
  isChatAccessible,
  isNotesAccessible,
  isPollsAccessible,
} from '../authorization/featureAccess';


interface RightSidebarProps {
  messages: Message[];
  onSendMessage: (content: string, parentMessageId?: string) => void;
  onEditMessage?: (messageId: string, content: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  typingUsers: string[];
  currentUser: Participant;
  isRealtimeReady: boolean;
  polls: Poll[];
  onCreatePoll: (poll: CreatePollRequest) => void;
  onVotePoll: (pollId: string, optionIds: string[]) => void;
  onClosePoll: (pollId: string) => void;
  roomId: string;
  isVideoActive?: boolean;
  setIsVideoActive?: (active: boolean) => void;
  isVideoExpanded?: boolean;
  setIsVideoExpanded?: (expanded: boolean) => void;
  onJitsiApiReady?: (api: IJitsiMeetExternalApi) => void;
  videoFocusTrigger?: number;
}

import type { FeatureKey } from '../../../shared/types/api/room';

type SidebarTab = {
  id: TabType;
  icon: React.ReactNode;
  label: string;
  isAccessible: boolean;
  feature: FeatureKey;
};

const RightSidebar: React.FC<RightSidebarProps> = ({
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onTypingChange,
  typingUsers,
  currentUser,
  isRealtimeReady,
  polls,
  onCreatePoll,
  onVotePoll,
  onClosePoll,
  roomId,
  isVideoActive = false,
  setIsVideoActive,
  isVideoExpanded = false,
  setIsVideoExpanded,
  onJitsiApiReady,
  videoFocusTrigger = 0,
}) => {
  const authorization = useRoomAuthorization();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isPiPMode, setIsPiPMode] = useState(false);
  const [isJitsiJoined, setIsJitsiJoined] = useState(false);
  const dragControls = useDragControls();
  const [unreadMessage, setUnreadMessage] = useState<Message | null>(null);
  const prevMessagesLength = useRef(messages.length);
  
  // Resizable width for video mode
  const [workspaceWidth, setWorkspaceWidth] = useState(350);

  const panelRef = useRef<HTMLElement>(null);
  const [actualPanelWidth, setActualPanelWidth] = useState(workspaceWidth);

  useEffect(() => {
    if (!panelRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setActualPanelWidth(entry.contentRect.width);
      }
    });
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  // Focus trigger: when user clicks topbar video button but meeting is already active
  React.useEffect(() => {
    if (videoFocusTrigger > 0 && isVideoActive) {
      setActiveTab('video');
      setIsCollapsed(false);
      setIsVideoExpanded?.(false); // Optional: un-expand to show normal workspace
    }
  }, [videoFocusTrigger, isVideoActive, setIsVideoExpanded]);

  // When video becomes inactive but tab is still video, switch to chat
  React.useEffect(() => {
    if (!isVideoActive && activeTab === 'video') {
      setActiveTab('chat');
    }
  }, [isVideoActive, activeTab]);

  // When PiP mode is active, hide video tab and switch to chat
  React.useEffect(() => {
    if (isPiPMode && activeTab === 'video') {
      setActiveTab('chat');
    }
  }, [isPiPMode, activeTab]);

  // Prevent other tabs from being stretched too wide
  React.useEffect(() => {
    if (activeTab !== 'video') {
      if (isVideoExpanded) {
        setIsVideoExpanded?.(false);
      }
      if (workspaceWidth > 500) {
        setWorkspaceWidth(350);
      }
    }
  }, [activeTab, isVideoExpanded, workspaceWidth, setIsVideoExpanded]);

  // When video becomes active, auto-switch to video tab and open sidebar
  React.useEffect(() => {
    if (isVideoActive) {
      setActiveTab('video');
      setIsCollapsed(false);
    }
  }, [isVideoActive]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = workspaceWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.min(Math.max(350, startWidth + deltaX), window.innerWidth - 100);
      setWorkspaceWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  let tabs: SidebarTab[] = [
    {
      id: 'chat',
      icon: <MessageSquare className="w-4 h-4" />,
      label: 'Chat',
      isAccessible: isChatAccessible(authorization),
      feature: 'chat',
    },
    {
      id: 'notes',
      icon: <StickyNote className="w-4 h-4" />,
      label: 'Notes',
      isAccessible: isNotesAccessible(authorization),
      feature: 'notes',
    },
    {
      id: 'polls',
      icon: <BarChart2 className="w-4 h-4" />,
      label: 'Polls',
      isAccessible: isPollsAccessible(authorization),
      feature: 'polls',
    },
  ];

  if (isVideoActive && !isPiPMode) {
    tabs.push({
      id: 'video',
      icon: <Video className="w-4 h-4" />,
      label: 'Video',
      isAccessible: true,
      feature: 'video_audio',
    });
  }

  const handleTabClick = (id: TabType) => {
    setActiveTab(id);
    if (isCollapsed) setIsCollapsed(false);
  };

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]!;

  const renderContent = () => {
    if (isCollapsed) return null;

    if (!activeTabMeta.isAccessible) {
      return (
        <FeatureLockedPanel
          feature={activeTabMeta.feature}
          reason={getFeatureLockReason(
            authorization,
            activeTabMeta.feature,
            false,
          )}
          planName={authorization.featureSnapshot?.planName}
        />
      );
    }

    switch (activeTab) {
      case 'chat':
        return (
          <ChatPanel
            messages={messages}
            onSendMessage={onSendMessage}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onTypingChange={onTypingChange}
            typingUsers={typingUsers}
            currentUser={currentUser}
            isRealtimeReady={isRealtimeReady}
          />
        );
      case 'notes':
        return <NotesPanel roomId={roomId} />;
      case 'polls':
        return (
          <PollsPanel
            roomId={roomId}
            polls={polls}
            onCreatePoll={onCreatePoll}
            onVotePoll={onVotePoll}
            onClosePoll={onClosePoll}
            currentUser={currentUser}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      const latest = messages[messages.length - 1];
      if (latest && latest.senderId !== currentUser.id) {
        if (activeTab !== 'chat' || isCollapsed) {
          setUnreadMessage(latest);
          const timer = setTimeout(() => setUnreadMessage(null), 4000);
          return () => clearTimeout(timer);
        }
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, currentUser.id, activeTab, isCollapsed]);

  // Two Distinct Modes
  // Mode 1: Normal Workspace (!isVideoActive) -> Fixed width 350px, no breakpoint logic
  // Mode 2: Video Workspace (isVideoActive) -> Resizable, Expandable, responsive breakpoint logic
  
  const currentWidth = isCollapsed 
    ? 56 
    : (!isVideoActive 
        ? 350 
        : (isVideoExpanded ? '100%' : (isPiPMode ? 350 : workspaceWidth)));

  const isVisuallyExpanded = isVideoExpanded || (isVideoActive && !isPiPMode && workspaceWidth > (window.innerWidth * 0.45));

  return (
    <aside
      ref={panelRef}
      className={`relative border-l border-gray-800 bg-[#0d1117] flex flex-col h-full ${
        !isResizing ? 'transition-all duration-300 ease-in-out' : ''
      }`}
      style={{ 
        width: currentWidth, 
        minWidth: currentWidth, 
        maxWidth: isVideoExpanded && !isPiPMode ? '100%' : currentWidth 
      }}
    >
      {/* Resizer Handle (Only in Video Mode) */}
      {isVideoActive && !isCollapsed && !isVideoExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 z-50 transition-colors"
        />
      )}
      
      {/* Header Area */}
      <div className={`flex flex-col bg-[#0d1117] shrink-0 ${isCollapsed ? 'h-full py-4' : 'pt-3 px-3'} ${!isCollapsed ? 'border-b border-gray-800' : ''}`}>
          <div className={`flex items-center mb-4 ${isCollapsed ? 'flex-col gap-4' : 'justify-between px-1'}`}>
             {!isCollapsed && (
               <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                 Workspace
               </h2>
             )}

             <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-2 ml-auto'}`}>
               {isVideoActive && !isCollapsed && (
                 <>
                   {!isPiPMode && isJitsiJoined && (
                     <button
                       type="button"
                       onClick={() => setIsPiPMode(true)}
                       className="flex items-center gap-1.5 p-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all text-xs font-medium border border-transparent hover:border-gray-700"
                       title="Picture in Picture"
                     >
                       <PictureInPicture2 className="w-4 h-4" />
                     </button>
                   )}
                   <button
                     type="button"
                     onClick={() => {
                       if (isVisuallyExpanded) {
                         setIsVideoExpanded?.(false);
                         setWorkspaceWidth(350);
                       } else {
                         setIsVideoExpanded?.(true);
                       }
                     }}
                     className="flex items-center gap-1.5 p-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all text-xs font-medium border border-transparent hover:border-gray-700"
                     title={isVisuallyExpanded ? "Shrink Workspace" : "Expand Meeting"}
                   >
                     {isVisuallyExpanded ? 'Shrink' : 'Expand'}
                   </button>
                 </>
               )}
               <button
                  type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all"
               >
                 {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
               </button>
             </div>
          </div>

          {/* Tabs */}
          <div className={`flex ${isCollapsed ? 'flex-col gap-4 mt-4 items-center' : 'items-center gap-1'}`}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
            const isLocked = !tab.isAccessible;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`transition-all relative group ${
                  isCollapsed
                    ? 'p-2 rounded-xl'
                    : 'flex-1 flex flex-col items-center gap-1.5 py-2 px-1 text-[10px] font-bold uppercase rounded-t-lg border-b-2'
                } ${
                  isLocked
                    ? isCollapsed
                      ? 'text-gray-600 opacity-45 hover:opacity-70'
                      : 'text-gray-600 opacity-50 border-transparent hover:text-gray-400 hover:opacity-70'
                    : isActive
                      ? 'text-blue-400 bg-[#161b22] ' + (!isCollapsed ? 'border-blue-500' : '')
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border-transparent'
                }`}
                title={isLocked ? `${tab.label} — upgrade to unlock` : tab.label}
                aria-disabled={isLocked}
              >
                <div
                  className={`relative ${
                    isActive && !isLocked ? 'scale-110' : 'group-hover:scale-105'
                  } ${isLocked ? 'grayscale' : ''}`}
                >
                  {tab.icon}
                  {isLocked && (
                    <Lock className="absolute -bottom-1 -right-1 h-2.5 w-2.5 text-gray-500" />
                  )}
                </div>
                {!isCollapsed && <span className="tracking-tighter">{tab.label}</span>}

                {isCollapsed && isActive && (
                  <div
                    className={`absolute left-0 w-1 h-4 rounded-r-full ${
                      isLocked ? 'bg-gray-600' : 'bg-blue-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
          </div>
        </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0d1117]">
        {/* Render Video meeting persistently when active */}
        {isVideoActive && (
          <motion.div 
            drag={isPiPMode}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            className={
              isPiPMode 
                ? "fixed bottom-6 right-6 w-[400px] h-[250px] z-[100] rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-black flex flex-col"
                : "absolute inset-0 flex flex-col"
            }
            style={isPiPMode ? { touchAction: 'none' } : {}}
          >
            {isPiPMode && (
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full h-8 bg-gray-900/90 z-10 flex justify-between items-center px-3 cursor-move border-b border-gray-700 shrink-0"
              >
                 <span className="text-xs font-medium text-gray-300">Video Call (PiP)</span>
                 <button onClick={() => setIsPiPMode(false)} className="text-xs text-blue-400 hover:text-blue-300">Restore</button>
              </div>
            )}
            <div className={`w-full ${isPiPMode ? 'h-[calc(100%-2rem)]' : 'h-full'} ${isPiPMode ? 'pointer-events-auto' : ''}`}>
              <VideoMeeting 
                roomId={roomId} 
                onClose={() => setIsVideoActive?.(false)}
                onJitsiApiReady={(api) => {
                  api.addListener('videoConferenceJoined', () => setIsJitsiJoined(true));
                  api.addListener('videoConferenceLeft', () => setIsJitsiJoined(false));
                  onJitsiApiReady?.(api);
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Render standard tab content conditionally, natively covering the video via layering */}
        {activeTab !== 'video' && (
          <div className={`absolute inset-0 z-10 bg-[#0d1117] flex flex-col ${!isVideoActive ? 'relative flex-1' : ''}`}>
            <div className="flex-1 w-full flex flex-col relative overflow-hidden">
              {renderContent()}
            </div>
          </div>
        )}

        {/* Unread Message Toast */}
        <AnimatePresence>
          {unreadMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-4 left-4 right-4 z-50 bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl cursor-pointer"
              onClick={() => {
                setActiveTab('chat');
                if (isCollapsed) setIsCollapsed(false);
                setUnreadMessage(null);
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold uppercase">
                  {unreadMessage.senderName.charAt(0)}
                </div>
                <span className="text-xs font-medium text-gray-300">
                  {unreadMessage.senderName}
                </span>
                <span className="text-[10px] text-blue-400 ml-auto bg-blue-500/10 px-1.5 py-0.5 rounded">New Message</span>
              </div>
              <p className="text-sm text-white line-clamp-2 pl-8">{unreadMessage.content}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default RightSidebar;
