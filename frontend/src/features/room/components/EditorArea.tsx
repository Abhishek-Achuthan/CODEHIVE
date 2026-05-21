import React, { useState } from 'react';
import {
  FileCode,
  Play,
  Terminal,
  Info,
  Search,
  Layout,
  Lock,
} from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';
import Whiteboard from './whiteboard/Whiteboard';
import { useAppSelector } from '../../../shared/hooks/storeHooks';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';

type ViewMode = 'editor' | 'whiteboard';

interface EditorAreaProps {
  roomId: string;
}

const EditorArea: React.FC<EditorAreaProps> = ({ roomId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const user = useAppSelector((state) => state.auth.user);
  const authorization = useRoomAuthorization();

  if (!roomId || !user) {
    return <div className="text-white p-4">Invalid session</div>;
  }

  const availableViews: ViewMode[] = [];
  if (authorization.canViewCodeEditor || authorization.canEditCodeEditor) {
    availableViews.push('editor');
  }
  if (authorization.canViewWhiteboard || authorization.canEditWhiteboard) {
    availableViews.push('whiteboard');
  }

  const currentView = availableViews.includes(viewMode) ? viewMode : availableViews[0] ?? 'editor';

  return (
    <main className="flex-1 flex flex-col bg-[#010409] relative overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-gray-800 flex items-center bg-[#0d1117] px-4 justify-between">
        <div className="flex items-center gap-1">
          {availableViews.includes('editor') && (
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 h-10 text-xs font-medium transition-all border-b-2 ${
                currentView === 'editor'
                  ? 'bg-[#161b22] text-blue-400 border-blue-500'
                  : 'text-gray-500 hover:text-gray-300 border-transparent'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>App.tsx</span>
            </button>
          )}

          {availableViews.includes('whiteboard') && (
            <button
              onClick={() => setViewMode('whiteboard')}
              className={`flex items-center gap-1.5 px-3 h-10 text-xs font-medium transition-all border-b-2 ${
                currentView === 'whiteboard'
                  ? 'bg-[#161b22] text-blue-400 border-blue-500'
                  : 'text-gray-500 hover:text-gray-300 border-transparent'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Whiteboard</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentView === 'editor' && (
            <button
              disabled={!authorization.canRunCode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border ${
                authorization.canRunCode
                  ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30 border-green-500/20'
                  : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
              }`}
            >
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
        {availableViews.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400 bg-[#0d1117]">
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <Lock className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-sm font-semibold text-gray-100">Collaboration tools unavailable</p>
                <p className="text-xs text-gray-500 mt-1">
                  This room does not currently expose any editor or whiteboard capabilities.
                </p>
              </div>
            </div>
          </div>
        ) : currentView === 'editor' ? (
          <CollaborativeEditor
            roomId={roomId}
            canCollaborate={authorization.canUseCodeCollaboration}
            isReadonly={authorization.isReadonly}
          />
        ) : (
          <Whiteboard 
            roomId={roomId} 
            user={{ userId: user.id, userName: `${user.firstName} ${user.lastName}` }}
            canEdit={authorization.canEditWhiteboard}
            canCollaborate={authorization.canUseWhiteboardCollaboration}
            isReadonly={authorization.isReadonly}
          />
        )}

        {/* Floating Controls (Editor only) */}
        {currentView === 'editor' && (
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
            {currentView === 'editor' ? 'UTF-8' : 'Collaborative Canvas'}
          </span>
          <span>{currentView === 'editor' ? 'TypeScript JSX' : 'Real-time'}</span>
        </div>
        <div className="flex items-center gap-4">
          {currentView === 'editor' && (
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
