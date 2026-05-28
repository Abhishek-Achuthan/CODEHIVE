import React, { useState } from 'react';
import {
  MessageSquare, StickyNote, BarChart2,
  Search, Settings, ChevronRight, ChevronLeft, Lock,
} from 'lucide-react';
import type { TabType, RoomMessage as Message, Participant } from '../types';
import ChatPanel from './ChatPanel';
import PollsPanel from './PollsPanel';
import NotesPanel from './notes/NotesPanel';
import { FeatureLockedPanel } from './FeatureLockedPanel';
import type { Poll } from '../../../shared/socket/roomTypes';
import type { CreatePollRequest } from '../../../shared/types/api/room';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
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
  onOpenSettings?: () => void;
}

type SidebarTab = {
  id: TabType;
  icon: React.ReactNode;
  label: string;
  isAccessible: boolean;
  feature: 'chat' | 'notes' | 'polls';
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
  onOpenSettings,
}) => {
  const authorization = useRoomAuthorization();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs: SidebarTab[] = [
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

  return (
    <aside
      className={`border-l border-gray-800 bg-[#0d1117] flex flex-col h-full transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[56px]' : 'w-[400px]'
      }`}
    >
      <div className={`flex flex-col bg-[#0d1117] ${isCollapsed ? 'h-full py-4' : 'pt-3 px-3 border-b border-gray-800'}`}>
        <div className={`flex items-center mb-4 ${isCollapsed ? 'flex-col gap-4' : 'justify-between px-1'}`}>
           {!isCollapsed && <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Workspace</h2>}

           <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-2'}`}>
             <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all"
             >
               {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
             </button>
             {!isCollapsed && (
               <>
                 <Search className="w-3.5 h-3.5 text-gray-500 hover:text-white cursor-pointer" />
                 <button
                   type="button"
                   onClick={onOpenSettings}
                   className="rounded p-0.5 text-gray-500 transition-colors hover:text-white"
                   title="Room settings"
                 >
                   <Settings className="h-3.5 w-3.5" />
                 </button>
               </>
             )}
           </div>
        </div>

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

      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
    </aside>
  );
};

export default RightSidebar;
