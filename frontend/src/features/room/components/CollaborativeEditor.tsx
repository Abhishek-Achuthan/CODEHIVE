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
}) => {
  const collabRef = useRef<ReturnType<typeof createCollabProvider> | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const localEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [collaborationError, setCollaborationError] = React.useState<string | null>(null);

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
      yMeta.unobserve(handleLanguageChange);
      bindingRef.current?.destroy();
      bindingRef.current = null;
      collab.provider.destroy();
      collab.doc.destroy();
      if (collabRef.current === collab) {
        collabRef.current = null;
      }
    };
  }, [roomId, bindEditor, canCollaborate, onLanguageChange]);

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
      onMount={(editor) => {
        localEditorRef.current = editor;
        editorRef.current = editor; // Pass it up to EditorArea
        onEditorMount?.(editor);
        bindEditor();
      }}
      theme="vs-dark"
    />
  );
};

export default CollaborativeEditor;
