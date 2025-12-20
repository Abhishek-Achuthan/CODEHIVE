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
    <div className="border rounded-b-lg bg-zinc-900/50 border-zinc-800">
      <div className="p-2 border-b border-zinc-800/40">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            aria-label="Bold"
            className="p-2 rounded hover:bg-zinc-800 text-gray-300"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            aria-label="Italic"
            className="p-2 rounded hover:bg-zinc-800 text-gray-300"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading"
            className="p-2 rounded hover:bg-zinc-800 text-gray-300"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
            className="p-2 rounded hover:bg-zinc-800 text-gray-300"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            aria-label="Code block"
            className="p-2 rounded hover:bg-zinc-800 text-gray-300"
          >
            {"</>"}
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            aria-label="Section separator"
            className="p-2 rounded hover:bg-zinc-800 text-gray-300"
          >
            ---
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-48 text-sm" />
    </div>
  );
 }
