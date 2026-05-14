import React, { useState } from 'react';
import { Lock, Users } from 'lucide-react';
import PrivateNotes from './PrivateNotes';

interface NotesPanelProps {
  roomId: string;
}

type NoteTab = 'private' | 'public';

const NotesPanel: React.FC<NotesPanelProps> = ({ roomId }) => {
  const [activeTab, setActiveTab] = useState<NoteTab>('private');

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Tab toggle header */}
      <div className="px-3 pt-3 pb-0 border-b border-gray-800">
        <div className="flex items-center gap-1 p-1 bg-[#161b22] rounded-lg w-fit">
          <TabButton
            id="private"
            icon={<Lock className="w-3 h-3" />}
            label="Private"
            isActive={activeTab === 'private'}
            onClick={() => setActiveTab('private')}
          />
          <TabButton
            id="public"
            icon={<Users className="w-3 h-3" />}
            label="Public"
            isActive={activeTab === 'public'}
            onClick={() => setActiveTab('public')}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'private' ? (
          <PrivateNotes roomId={roomId} />
        ) : (
          <PublicNotesPlaceholder />
        )}
      </div>
    </div>
  );
};

interface TabButtonProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
      isActive
        ? 'bg-[#0d1117] text-blue-400 shadow-sm'
        : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

const PublicNotesPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
    <div className="w-14 h-14 bg-[#161b22] rounded-full flex items-center justify-center border border-gray-800">
      <Users className="w-7 h-7 text-gray-700" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-300">Collaborative notes</h3>
      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed max-w-[180px]">
        Shared notes with real-time collaboration are coming soon.
      </p>
    </div>
    <span className="px-2.5 py-1 bg-[#161b22] border border-gray-800 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
      Coming Soon
    </span>
  </div>
);

export default NotesPanel;
