import React, { useState } from 'react';
import {
  FileCode,
  Play,
  Terminal,
  Info,
  Search,
  Layout,
  Lock,
  Settings,
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
import {
  getCollaborationLockDescription,
  getCollaborationLockTitle,
} from '../authorization/lifecycleMessages';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useOnClickOutside } from '../../../shared/hooks/useOnClickOutside';
import TerminalPanel from './TerminalPanel';
import { Language } from '../../../api/endpoints/codeAPI';
import type * as monaco from 'monaco-editor';

type ViewMode = 'editor' | 'whiteboard';

interface EditorAreaProps {
  roomId: string;
}

const EditorArea: React.FC<EditorAreaProps> = ({ roomId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.TYPESCRIPT);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  const [cursorPos, setCursorPos] = useState({ lineNumber: 1, column: 1 });
  const [indentInfo, setIndentInfo] = useState({ type: 'Spaces', size: 2 });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsContainerRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(settingsContainerRef, () => setIsSettingsOpen(false));
  
  const user = useAppSelector((state) => state.auth.user);
  const authorization = useRoomAuthorization();
  
  // Use a ref to access the editor instance for fetching code content
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { run, isRunning, result, error } = useCodeExecution(roomId);

  React.useEffect(() => {
    if (!editorInstance) return;

    const saved = localStorage.getItem('codehive_editor_indent_prefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        const model = editorInstance.getModel();
        if (model) {
          model.updateOptions({
            insertSpaces: prefs.type === 'Spaces',
            tabSize: prefs.size,
          });
        }
      } catch (e) {}
    }
  }, [editorInstance]);

  const handleIndentChange = (type: 'Spaces' | 'Tabs', size: number) => {
    if (editorInstance) {
      const model = editorInstance.getModel();
      if (model) {
        model.updateOptions({
          insertSpaces: type === 'Spaces',
          tabSize: size,
        });
      }
      localStorage.setItem('codehive_editor_indent_prefs', JSON.stringify({ type, size }));
    }
  };

  React.useEffect(() => {
    if (!editorInstance) return;

    const updateCursor = () => {
      const pos = editorInstance.getPosition();
      if (pos) {
        setCursorPos({ lineNumber: pos.lineNumber, column: pos.column });
      }
    };

    const updateIndent = () => {
      const model = editorInstance.getModel();
      if (model) {
        const opts = model.getOptions();
        setIndentInfo({
          type: opts.insertSpaces ? 'Spaces' : 'Tabs',
          size: opts.tabSize,
        });
      }
    };

    updateCursor();
    updateIndent();

    const cursorDisposable = editorInstance.onDidChangeCursorPosition(updateCursor);
    const optionsDisposable = editorInstance.onDidChangeModelOptions(updateIndent);

    return () => {
      cursorDisposable.dispose();
      optionsDisposable.dispose();
    };
  }, [editorInstance]);

  if (!roomId || !user) {
    return <div className="text-white p-4">Invalid session</div>;
  }

  const editorAccessible = isCodeEditorAccessible(authorization);
  const whiteboardAccessible = isWhiteboardAccessible(authorization);
  const collabLockTitle = getCollaborationLockTitle(authorization);
  const collabLockDescription = getCollaborationLockDescription(authorization);


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
          lockTitle={collabLockTitle}
          lockDescription={collabLockDescription}
          language={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          editorRef={editorRef}
          onEditorMount={setEditorInstance}
        />
      );
    }

    return (
      <Whiteboard
        roomId={roomId}
        user={{ userId: user.id, userName: `${user.firstName} ${user.lastName}` }}
        canEdit={authorization.canEditWhiteboard}
        canCollaborate={authorization.canUseWhiteboardCollaboration}
        lockTitle={collabLockTitle}
        lockDescription={collabLockDescription}
      />
    );
  };

  const handleRunCode = () => {
    if (!editorRef.current) return;
    const sourceCode = editorRef.current.getValue();
    setIsTerminalOpen(true);
    run(sourceCode, selectedLanguage);
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

        <div className="flex items-center gap-2">
          {viewMode === 'editor' && editorAccessible && (
            <>
              <div className="relative flex items-center" ref={settingsContainerRef}>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`flex items-center justify-center p-1.5 rounded-md border transition-colors ${
                    isSettingsOpen
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-300'
                  }`}
                  title="Editor Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                {isSettingsOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-[#161b22] border border-gray-800 rounded-lg shadow-2xl p-3 text-xs w-48 z-50">
                    <h4 className="text-gray-400 font-semibold mb-2">Editor Settings</h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 mb-1 mt-1 font-medium">Indentation</span>
                      <button 
                        type="button"
                        onClick={() => handleIndentChange('Spaces', 2)}
                        className={`text-left px-2 py-1.5 rounded-md transition-colors ${indentInfo.type === 'Spaces' && indentInfo.size === 2 ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                      >
                        Spaces: 2
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleIndentChange('Spaces', 4)}
                        className={`text-left px-2 py-1.5 rounded-md transition-colors ${indentInfo.type === 'Spaces' && indentInfo.size === 4 ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                      >
                        Spaces: 4
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-px h-4 bg-gray-800 mx-1"></div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded border border-gray-700 outline-none"
              >
                {Object.values(Language).map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={handleRunCode}
                disabled={!authorization.canRunCode || isRunning}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border ${
                  authorization.canRunCode && !isRunning
                    ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30 border-green-500/20'
                    : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden group flex flex-col">
        {renderMainContent()}

        {isTerminalOpen && viewMode === 'editor' && (
          <TerminalPanel 
            result={result}
            error={error}
            isRunning={isRunning}
            onClose={() => setIsTerminalOpen(false)}
          />
        )}
      </div>

      <div className="h-6 border-t border-gray-800 bg-[#0d1117] flex items-center gap-4 px-3 text-[10px] text-gray-500 uppercase">
        {viewMode === 'editor' && editorAccessible && editorInstance && (
          <>
            <span>{selectedLanguage}</span>
            <span>Ln {cursorPos.lineNumber}, Col {cursorPos.column}</span>
            <span>{indentInfo.type}: {indentInfo.size}</span>
          </>
        )}
      </div>
    </main>
  );
};

export default EditorArea;
