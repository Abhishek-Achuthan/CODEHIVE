
import React, { useState } from 'react';
import { MessageSquare, Layout, StickyNote, BarChart2, Search, Settings } from 'lucide-react';
import type { TabType, RoomMessage as Message, Participant } from '../types';
import ChatPanel from './ChatPanel';

interface RightSidebarProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  typingUsers: string[];
  currentUser: Participant;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  messages,
  onSendMessage,
  onTypingChange,
  typingUsers,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'chat', icon: <MessageSquare className="w-4 h-4" />, label: 'Chat' },
    { id: 'whiteboard', icon: <Layout className="w-4 h-4" />, label: 'Whiteboard' },
    { id: 'notes', icon: <StickyNote className="w-4 h-4" />, label: 'Notes' },
    { id: 'polls', icon: <BarChart2 className="w-4 h-4" />, label: 'Polls' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatPanel
            messages={messages}
            onSendMessage={onSendMessage}
            onTypingChange={onTypingChange}
            typingUsers={typingUsers}
            currentUser={currentUser}
          />
        );
      case 'whiteboard':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-full">
              <Layout className="w-10 h-10 text-gray-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-300">Whiteboard is empty</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">Start drawing or dragging components to collaborate visually.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-lg text-xs font-semibold transition-all border border-blue-500/20">
              Create New Board
            </button>
          </div>
        );
      case 'notes':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 space-y-4">
             <div className="p-4 bg-gray-800/30 rounded-full">
              <StickyNote className="w-10 h-10 text-gray-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-300">No active notes</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">Collaborative notes will appear here. Capture your ideas together.</p>
            </div>
             <button className="px-4 py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-lg text-xs font-semibold transition-all border border-blue-500/20">
              Take a Note
            </button>
          </div>
        );
      case 'polls':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-full">
              <BarChart2 className="w-10 h-10 text-gray-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-300">No active polls</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">Create a poll to get instant feedback from your team members.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-lg text-xs font-semibold transition-all border border-blue-500/20">
              Launch Poll
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 border-l border-gray-800 bg-[#0d1117] flex flex-col h-full overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b border-gray-800 bg-[#0d1117] flex flex-col pt-3 px-3">
        <div className="flex items-center justify-between mb-4 px-1">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Workspace</h2>
           <div className="flex items-center gap-2">
             <button className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-md transition-all">
               <Search className="w-3.5 h-3.5" />
             </button>
             <button className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-md transition-all">
               <Settings className="w-3.5 h-3.5" />
             </button>
           </div>
        </div>
        
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-1 text-[10px] font-bold uppercase tracking-tighter transition-all rounded-t-lg relative group ${
                activeTab === tab.id
                  ? 'text-blue-400 bg-[#161b22] border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border-b-2 border-transparent'
              }`}
            >
              <div className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
    </aside>
  );
};

export default RightSidebar;
