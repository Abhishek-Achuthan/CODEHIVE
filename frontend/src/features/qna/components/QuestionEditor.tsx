import { useEffect } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import { createQnaEditorExtensions, getQnaEditorAttributes } from "./qnaEditorBase";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const DEFAULT_TEMPLATE =
  "Problem description\n\n" +
  "What I tried\n\n" +
  "Expected vs actual behavior\n\n" +
  "---\n\n" +
  "Code / error output (paste here)\n";

export default function QuestionEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      ...createQnaEditorExtensions({
        placeholder: placeholder ?? DEFAULT_TEMPLATE,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        ...getQnaEditorAttributes({
          ariaLabel: placeholder ?? "Question description editor",
        }),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [editor, value]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#121214] overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
      <div className="p-2 border-b border-zinc-800 bg-[#09090b]">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            aria-label="Bold"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            aria-label="Italic"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <em>I</em>
          </button>
          <div className="w-px h-5 bg-zinc-800 my-auto mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            •
          </button>
          <div className="w-px h-5 bg-zinc-800 my-auto mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            aria-label="Code block"
            className="w-10 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-mono"
          >
            {"</>"}
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            aria-label="Section separator"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors tracking-tighter"
          >
            ---
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-[250px] text-zinc-200 prose prose-invert max-w-none prose-sm" />
    </div>
  );
 }
