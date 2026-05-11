import React, { useCallback, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { MonacoBinding } from 'y-monaco';
import { createCollabProvider } from '../../collaboration/yjs/provider';

interface Props {
  roomId: string;
}

const CollaborativeEditor: React.FC<Props> = ({ roomId }) => {
  const collabRef = useRef<ReturnType<typeof createCollabProvider> | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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
    const collab = createCollabProvider(roomId);
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
  }, [roomId, bindEditor]);

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
