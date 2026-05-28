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
import { FeatureLockedPanel } from './FeatureLockedPanel';
import { useAppSelector } from '../../../shared/hooks/storeHooks';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import {
  getFeatureLockReason,
  isCodeEditorAccessible,
  isWhiteboardAccessible,
} from '../authorization/featureAccess';

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

  const editorAccessible = isCodeEditorAccessible(authorization);
  const whiteboardAccessible = isWhiteboardAccessible(authorization);

  const views: {
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    isAccessible: boolean;
    feature: 'code_editor' | 'whiteboard';
  }[] = [
    {
      id: 'editor',
      label: 'App.tsx',
      icon: <FileCode className="w-3.5 h-3.5" />,
      isAccessible: editorAccessible,
      feature: 'code_editor',
    },
    {
      id: 'whiteboard',
      label: 'Whiteboard',
      icon: <Layout className="w-3.5 h-3.5" />,
      isAccessible: whiteboardAccessible,
      feature: 'whiteboard',
    },
  ];

  const activeView = views.find((v) => v.id === viewMode) ?? views[0]!;

  const renderMainContent = () => {
    if (!activeView.isAccessible) {
      return (
        <FeatureLockedPanel
          feature={activeView.feature}
          reason={getFeatureLockReason(
            authorization,
            activeView.feature,
            false,
          )}
          planName={authorization.featureSnapshot?.planName}
        />
      );
    }

    if (viewMode === 'editor') {
      return (
        <CollaborativeEditor
          roomId={roomId}
          canCollaborate={authorization.canUseCodeCollaboration}
          isReadonly={authorization.isReadonly}
        />
      );
    }

    return (
      <Whiteboard
        roomId={roomId}
        user={{ userId: user.id, userName: `${user.firstName} ${user.lastName}` }}
        canEdit={authorization.canEditWhiteboard}
        canCollaborate={authorization.canUseWhiteboardCollaboration}
        isReadonly={authorization.isReadonly}
      />
    );
  };

  return (
    <main className="flex-1 flex flex-col bg-[#010409] relative overflow-hidden">
      <div className="h-10 border-b border-gray-800 flex items-center bg-[#0d1117] px-4 justify-between">
        <div className="flex items-center gap-1">
          {views.map((view) => {
            const isActive = viewMode === view.id;
            const isLocked = !view.isAccessible;

            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setViewMode(view.id)}
                className={`flex items-center gap-1.5 px-3 h-10 text-xs font-medium transition-all border-b-2 ${
                  isLocked
                    ? 'text-gray-600 opacity-50 border-transparent hover:text-gray-400 hover:opacity-70'
                    : isActive
                      ? 'bg-[#161b22] text-blue-400 border-blue-500'
                      : 'text-gray-500 hover:text-gray-300 border-transparent'
                }`}
                title={isLocked ? `${view.label} — upgrade to unlock` : view.label}
              >
                <span className={isLocked ? 'grayscale' : ''}>{view.icon}</span>
                <span>{view.label}</span>
                {isLocked && <Lock className="h-3 w-3 text-gray-600" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {viewMode === 'editor' && editorAccessible && (
            <button
              type="button"
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

          <button
            type="button"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden group">
        {renderMainContent()}

        {viewMode === 'editor' && editorAccessible && (
          <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-[#161b22]/90 border border-gray-800 p-1.5 rounded-lg shadow-2xl flex items-center gap-1">
              <button
                type="button"
                className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-6 border-t border-gray-800 bg-[#0d1117] flex items-center justify-between px-3 text-[10px] text-gray-500 uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            {viewMode === 'editor' ? 'UTF-8' : 'Collaborative Canvas'}
          </span>
          <span>{viewMode === 'editor' ? 'TypeScript JSX' : 'Real-time'}</span>
        </div>
        <div className="flex items-center gap-4">
          {viewMode === 'editor' && editorAccessible && (
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
