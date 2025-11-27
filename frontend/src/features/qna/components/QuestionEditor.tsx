import { useEffect } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function QuestionEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-full focus:outline-none text-sm",
        spellCheck: "true",
        "aria-label": placeholder ?? "Question description editor",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    // Keep editor content in sync when value changes externally
    if (value === "" && editor.getHTML() !== "") {
      editor.commands.setContent("");
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
        </div>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-48 text-sm" />
    </div>
  );
}
