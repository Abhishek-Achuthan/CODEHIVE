import React, { useCallback, useEffect, useRef } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { MonacoBinding } from 'y-monaco';
import { createCollabProvider } from '../../collaboration/yjs/provider';

interface Props {
  roomId: string;
  canCollaborate: boolean;
  lockTitle: string;
  lockDescription: string;
}

const CollaborativeEditor: React.FC<Props> = ({
  roomId,
  canCollaborate,
  lockTitle,
  lockDescription,
}) => {
  const collabRef = useRef<ReturnType<typeof createCollabProvider> | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [collaborationError, setCollaborationError] = React.useState<string | null>(null);

  const bindEditor = useCallback(() => {
    const collab = collabRef.current;
    const editor = editorRef.current;
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

    bindEditor();

    return () => {
      bindingRef.current?.destroy();
      bindingRef.current = null;
      collab.provider.destroy();
      collab.doc.destroy();
      if (collabRef.current === collab) {
        collabRef.current = null;
      }
    };
  }, [roomId, bindEditor, canCollaborate]);

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
      defaultLanguage="typescript"
      defaultValue=""
      onMount={(editor) => {
        editorRef.current = editor;
        bindEditor();
      }}
      theme="vs-dark"
    />
  );
};

export default CollaborativeEditor;
