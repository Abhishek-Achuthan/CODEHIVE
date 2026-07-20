import React, { useCallback, useEffect, useRef } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { MonacoBinding } from 'y-monaco';
import { createCollabProvider } from '../../collaboration/yjs/provider';

import { Language } from '../../../api/endpoints/codeAPI';

interface Props {
  roomId: string;
  canCollaborate: boolean;
  lockTitle: string;
  lockDescription: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  user: {
    id: string;
    name: string;
  };
}

const CollaborativeEditor: React.FC<Props> = ({
  roomId,
  canCollaborate,
  lockTitle,
  lockDescription,
  language,
  onLanguageChange,
  editorRef,
  onEditorMount,
  user,
}) => {
  const collabRef = useRef<ReturnType<typeof createCollabProvider> | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const localEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [collaborationError, setCollaborationError] = React.useState<string | null>(null);

  const idleClientsRef = useRef<Set<number>>(new Set());
  const idleTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const bindEditor = useCallback(() => {
    const collab = collabRef.current;
    const editor = localEditorRef.current;
    const model = editor?.getModel();

    if (!collab || !editor || !model || bindingRef.current) return;

    const yText = collab.doc.getText('editor');

    bindingRef.current = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      collab.provider.awareness
    );
  }, []);

  const labelPositioningCleanupRef = useRef<(() => void) | null>(null);

  const setupLabelPositioning = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    const updateLabelPositions = () => {
      const editorNode = editor.getDomNode();
      if (!editorNode) return;

      const editorRect = editorNode.getBoundingClientRect();
      const heads = editorNode.querySelectorAll('[class*="yRemoteSelectionHead-"]');

      heads.forEach((head) => {
        const rect = head.getBoundingClientRect();
        const distanceToTop = rect.top - editorRect.top;
        
        // Hysteresis to prevent flickering when cursor is exactly on the boundary
        if (distanceToTop < 24) {
          head.classList.add('yRemote-label-below');
        } else if (distanceToTop > 34) {
          head.classList.remove('yRemote-label-below');
        }

        // Apply idle state
        const clientIdMatch = Array.from(head.classList).find(c => c.startsWith('yRemoteSelectionHead-') && c !== 'yRemoteSelectionHead-');
        if (clientIdMatch) {
          const clientIdStr = clientIdMatch.replace('yRemoteSelectionHead-', '');
          const clientId = parseInt(clientIdStr, 10);
          if (idleClientsRef.current.has(clientId)) {
            head.classList.add('yRemote-idle');
          } else {
            head.classList.remove('yRemote-idle');
          }
        }
      });
    };

    // Listen to scroll events and layout/decoration changes
    const d1 = editor.onDidScrollChange(updateLabelPositions);
    const d2 = editor.onDidChangeModelDecorations(updateLabelPositions);
    
    // Initial calculation
    requestAnimationFrame(updateLabelPositions);

    return () => {
      d1.dispose();
      d2.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canCollaborate) {
      setCollaborationError(null);
      return;
    }

    const collab = createCollabProvider(roomId, {
      onAuthenticationFailed: (reason) => {
        setCollaborationError(reason || 'You are not allowed to use the shared code editor.');
      },
    });
    collabRef.current = collab;

    // Generate a consistent cursor color based on user ID
    const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#9f7aea', '#ed64a6'];
    let hash = 0;
    for (let i = 0; i < user.id.length; i++) {
      hash = user.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    const userColor = colors[colorIndex];

    collab.provider.awareness.setLocalStateField('user', {
      name: user.name,
      color: userColor,
    });

    const updateAwarenessStyles = () => {
      const styleId = 'y-monaco-cursors-style';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      let css = '';
      const states = collab.provider.awareness.getStates();
      states.forEach((state, clientId) => {
        if (state.user) {
          const color = state.user.color || '#ffb61e';
          const name = state.user.name || 'Anonymous';

          css += `
            .yRemoteSelection-${clientId} {
              background-color: ${color}40;
            }
            .yRemoteSelectionHead-${clientId} {
              position: absolute;
              border-left: ${color} solid 2px;
              border-top: ${color} solid 2px;
              border-bottom: ${color} solid 2px;
              height: 100%;
              box-sizing: border-box;
            }
            .yRemoteSelectionHead-${clientId}::after {
              position: absolute;
              content: '${name}';
              background-color: ${color};
              color: #fff;
              text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
              border-radius: 4px;
              font-size: 11px;
              font-family: sans-serif;
              font-weight: 500;
              padding: 2px 6px;
              top: 0;
              transform: translateY(-100%) translateY(-4px);
              left: -2px;
              white-space: nowrap;
              z-index: 100;
              pointer-events: none;
              opacity: 1;
              transition: top 0.15s ease-out, transform 0.15s ease-out, opacity 0.2s ease-in-out;
            }
            .yRemoteSelectionHead-${clientId}.yRemote-label-below::after {
              top: 100%;
              transform: translateY(4px);
            }
            .yRemoteSelectionHead-${clientId}.yRemote-idle::after {
              opacity: 0;
            }
          `;
        }
      });
      styleElement.textContent = css;
    };

    const handleAwarenessChange = ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }) => {
      updateAwarenessStyles();

      const activeClients = [...added, ...updated];
      activeClients.forEach(clientId => {
        if (idleTimeoutsRef.current.has(clientId)) {
          clearTimeout(idleTimeoutsRef.current.get(clientId)!);
        }

        idleClientsRef.current.delete(clientId);
        
        const editorNode = localEditorRef.current?.getDomNode();
        if (editorNode) {
          const heads = editorNode.querySelectorAll(`.yRemoteSelectionHead-${clientId}`);
          heads.forEach(head => head.classList.remove('yRemote-idle'));
        }

        const timeout = setTimeout(() => {
          idleClientsRef.current.add(clientId);
          const currentEditorNode = localEditorRef.current?.getDomNode();
          if (currentEditorNode) {
            const heads = currentEditorNode.querySelectorAll(`.yRemoteSelectionHead-${clientId}`);
            heads.forEach(head => head.classList.add('yRemote-idle'));
          }
        }, 2500);

        idleTimeoutsRef.current.set(clientId, timeout);
      });

      removed.forEach(clientId => {
        if (idleTimeoutsRef.current.has(clientId)) {
          clearTimeout(idleTimeoutsRef.current.get(clientId)!);
          idleTimeoutsRef.current.delete(clientId);
        }
        idleClientsRef.current.delete(clientId);
      });
    };

    collab.provider.awareness.on('change', handleAwarenessChange);
    updateAwarenessStyles(); // Initial injection

    // Observe language changes from other collaborators
    const yMeta = collab.doc.getMap('meta');
    const handleLanguageChange = () => {
      const sharedLanguage = yMeta.get('language') as Language | undefined;
      if (sharedLanguage && Object.values(Language).includes(sharedLanguage)) {
        onLanguageChange(sharedLanguage);
      }
    };

    yMeta.observe(handleLanguageChange);
    handleLanguageChange();

    bindEditor();

    return () => {
      idleTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      idleTimeoutsRef.current.clear();
      idleClientsRef.current.clear();

      collab.provider.awareness.off('change', handleAwarenessChange);
      const styleElement = document.getElementById('y-monaco-cursors-style');
      if (styleElement) {
        styleElement.remove();
      }
      yMeta.unobserve(handleLanguageChange);
      bindingRef.current?.destroy();
      bindingRef.current = null;
      collab.provider.awareness.setLocalStateField('user', null);
      collab.provider.destroy();
      collab.doc.destroy();
      if (collabRef.current === collab) {
        collabRef.current = null;
      }
    };
  }, [roomId, bindEditor, canCollaborate, onLanguageChange, user.id, user.name]);

  useEffect(() => {
    return () => {
      if (labelPositioningCleanupRef.current) {
        labelPositioningCleanupRef.current();
        labelPositioningCleanupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (canCollaborate && collabRef.current) {
      const yMeta = collabRef.current.doc.getMap('meta');
      if (yMeta.get('language') !== language) {
        yMeta.set('language', language);
      }
    }
  }, [language, canCollaborate]);

  if (!canCollaborate) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0d1117] text-gray-400">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <Lock className="w-8 h-8 text-gray-600" />
          <div>
            <p className="text-sm font-semibold text-gray-200">{lockTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{lockDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  if (collaborationError) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0d1117] text-red-400">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <AlertCircle className="w-8 h-8" />
          <div>
            <p className="text-sm font-semibold text-gray-100">Code collaboration denied</p>
            <p className="text-xs text-gray-500 mt-1">{collaborationError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={language}
      defaultValue=""
      options={{
        formatOnPaste: true,
        wordHighlight: 'true' as any,
        renderLineHighlight: 'all',
        parameterHints: { enabled: true },
        codeLens: false, // Ensure additional complex features are disabled per request
        lightbulb: { enabled: false }, // Disable quick fixes
      }}
      onMount={(editor) => {
        localEditorRef.current = editor;
        editorRef.current = editor; // Pass it up to EditorArea
        onEditorMount?.(editor);
        bindEditor();
        labelPositioningCleanupRef.current = setupLabelPositioning(editor);
      }}
      theme="vs-dark"
    />
  );
};

export default CollaborativeEditor;
