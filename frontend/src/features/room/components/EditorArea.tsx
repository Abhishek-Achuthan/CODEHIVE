import React, { useState } from 'react';
import {
  FileCode,
  Play,
  Terminal,
  Info,
  Search,
  Layout,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import CollaborativeEditor from './CollaborativeEditor';
import Whiteboard from './whiteboard/Whiteboard';
import { useAppSelector } from '../../../shared/hooks/storeHooks';

type ViewMode = 'editor' | 'whiteboard';

interface EditorAreaProps {
  currentUserRole?: string;
}

const EditorArea: React.FC<EditorAreaProps> = ({ currentUserRole }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const user = useAppSelector((state) => state.auth.user);

  if (!roomId || !user) {
    return <div className="text-white p-4">Invalid session</div>;
  }

  const canEdit = currentUserRole === 'HOST' || currentUserRole === 'MENTOR';

  return (
    <main className="flex-1 flex flex-col bg-[#010409] relative overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-gray-800 flex items-center bg-[#0d1117] px-4 justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 h-10 text-xs font-medium transition-all border-b-2 ${
              viewMode === 'editor'
                ? 'bg-[#161b22] text-blue-400 border-blue-500'
                : 'text-gray-500 hover:text-gray-300 border-transparent'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>App.tsx</span>
          </button>
          
          <button
            onClick={() => setViewMode('whiteboard')}
            className={`flex items-center gap-1.5 px-3 h-10 text-xs font-medium transition-all border-b-2 ${
              viewMode === 'whiteboard'
                ? 'bg-[#161b22] text-blue-400 border-blue-500'
                : 'text-gray-500 hover:text-gray-300 border-transparent'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Whiteboard</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {viewMode === 'editor' && (
            <button className="flex items-center gap-1.5 px-3 py-1 bg-green-600/20 text-green-500 hover:bg-green-600/30 rounded-md text-xs font-semibold border border-green-500/20">
              <Play className="w-3 h-3 fill-current" />
              <span>Run Code</span>
            </button>
          )}

          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden group">
        {viewMode === 'editor' ? (
          <CollaborativeEditor roomId={roomId} />
        ) : (
          <Whiteboard 
            roomId={roomId} 
            user={{ userId: user.id, userName: `${user.firstName} ${user.lastName}` }}
            canEdit={canEdit}
          />
        )}

        {/* Floating Controls (Editor only) */}
        {viewMode === 'editor' && (
          <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-[#161b22]/90 border border-gray-800 p-1.5 rounded-lg shadow-2xl flex items-center gap-1">
              <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white">
                <Info className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white">
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-6 border-t border-gray-800 bg-[#0d1117] flex items-center justify-between px-3 text-[10px] text-gray-500 uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            {viewMode === 'editor' ? 'UTF-8' : 'Collaborative Canvas'}
          </span>
          <span>{viewMode === 'editor' ? 'TypeScript JSX' : 'Real-time'}</span>
        </div>
        <div className="flex items-center gap-4">
          {viewMode === 'editor' && (
            <>
              <span>Line 1</span>
              <span>Spaces: 2</span>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default EditorArea;