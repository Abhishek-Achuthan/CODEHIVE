import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Loader2, AlertCircle, RefreshCw, FileText, Lock } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import { usePublicNotes } from '../../hooks/usePublicNotes';
import SaveStatusIndicator from './SaveStatusIndicator';

interface PublicNotesProps {
  roomId: string;
  canEdit: boolean;
}

const PublicNotes: React.FC<PublicNotesProps> = ({ roomId, canEdit }) => {
  const {
    ydoc,
    persistedHTML,
    isLoading,
    loadError,
    collaborationError,
    saveStatus,
    triggerSave,
  } = usePublicNotes(roomId, canEdit);


const editor = useEditor({
  immediatelyRender: false,

  extensions: [
    StarterKit.configure({
      undoRedo: false,
    }),

    Placeholder.configure({
      placeholder: canEdit
        ? 'Start typing shared room notes...'
        : 'No notes yet for this room.',
    }),

    ...(ydoc
      ? [
          Collaboration.configure({
            document: ydoc,
          }),
        ]
      : []),
  ],

  editable: canEdit && !!ydoc,

  editorProps: {
    attributes: {
      class:
        'prose prose-invert prose-sm max-w-none focus:outline-none min-h-full text-gray-200 leading-relaxed',
    },
  },

  onCreate: ({ editor }) => {
    console.log('EDITOR CREATED');

    if (!ydoc) return;

    const fragment = ydoc.getXmlFragment('default');

    const isYjsDocEmpty = fragment.length === 0;

    console.log('IS YJS EMPTY:', isYjsDocEmpty);

    if (isYjsDocEmpty && persistedHTML) {
      editor.commands.setContent(persistedHTML, {
        emitUpdate: false,
      });
    }
  },

  onUpdate: ({ editor }) => {
    console.log('EDITOR UPDATED');

    if (canEdit) {
      triggerSave(editor.getHTML());
    }
  },
});

  // ── Seed editor with persisted content when Yjs doc is still empty ─────────
  // This prevents overwriting collaborative state on reconnects while still
  // loading the last-saved snapshot for brand-new Yjs sessions.
  useEffect(() => {
    if (isLoading || !editor || editor.isDestroyed || !ydoc) return;

    const fragment = ydoc.getXmlFragment('default');
    const isYjsDocEmpty = fragment.length === 0;

    if (isYjsDocEmpty && persistedHTML) {
      // emitUpdate: false prevents triggering the autosave on initial load
      editor.commands.setContent(persistedHTML, { emitUpdate: false });
    }
  }, [isLoading, editor, ydoc, persistedHTML]);

  // ── Cleanup Yjs / Hocuspocus on unmount ───────────────────────────────────
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500/60" />
        <span className="text-xs font-medium">Loading room notes...</span>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-300">Could not load notes</p>
          <p className="text-xs text-gray-500 mt-1">{loadError}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#161b22] hover:bg-[#1c2128] border border-gray-800 text-gray-300 rounded-lg transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      </div>
    );
  }

  if (canEdit && !ydoc && !collaborationError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500/60" />
        <span className="text-xs font-medium">Starting shared notes...</span>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/80 bg-[#0d1117]">
          <Lock className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            View Only
          </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
          {persistedHTML ? (
            <article
              className="prose prose-invert prose-sm max-w-none text-gray-200"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(persistedHTML) }}
            />
          ) : (
            <div className="flex items-center justify-center h-full gap-2 text-gray-600">
              <FileText className="w-5 h-5" />
              <span className="text-xs">No shared notes available.</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (collaborationError) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/80 bg-[#0d1117]">
          <Lock className="w-3 h-3 text-red-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
            Collaboration denied
          </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-4">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
            {collaborationError}
          </div>
          {persistedHTML ? (
            <article
              className="prose prose-invert prose-sm max-w-none text-gray-200"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(persistedHTML) }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // ── Main editor UI ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar — hidden for read-only users */}
      {canEdit ? (
        <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-gray-800/80 bg-[#0d1117]">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive('bold') ?? false}
            title="Bold"
          >
            <span className="font-bold text-[11px]">B</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive('italic') ?? false}
            title="Italic"
          >
            <span className="italic text-[11px]">I</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            isActive={editor?.isActive('strike') ?? false}
            title="Strikethrough"
          >
            <span className="line-through text-[11px]">S</span>
          </ToolbarButton>

          <div className="w-px h-3.5 bg-gray-800 mx-1" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive('bulletList') ?? false}
            title="Bullet list"
          >
            <span className="text-[11px] font-mono">•—</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={editor?.isActive('orderedList') ?? false}
            title="Numbered list"
          >
            <span className="text-[11px] font-mono">1.</span>
          </ToolbarButton>

          <div className="w-px h-3.5 bg-gray-800 mx-1" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            isActive={editor?.isActive('code') ?? false}
            title="Inline code"
          >
            <span className="font-mono text-[11px]">{`<>`}</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            isActive={editor?.isActive('codeBlock') ?? false}
            title="Code block"
          >
            <span className="font-mono text-[10px] leading-none">{`{}`}</span>
          </ToolbarButton>

          <div className="flex-1" />
          <SaveStatusIndicator status={saveStatus} />
        </div>
      ) : (
        /* Read-only banner */
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/80 bg-[#0d1117]">
          <Lock className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            View Only
          </span>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
        {editor ? (
          <EditorContent editor={editor} className="h-full" />
        ) : (
          <div className="flex items-center justify-center h-full gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Initializing editor...</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Shared toolbar button (mirrors PrivateNotes implementation) ──────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-6 h-6 flex items-center justify-center rounded transition-all ${
      isActive
        ? 'bg-blue-500/20 text-blue-400'
        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
    }`}
  >
    {children}
  </button>
);

export default PublicNotes;
