import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import toast from "react-hot-toast";
import { createQnaEditorExtensions, getQnaEditorAttributes } from "./qnaEditorBase";

interface AnswerEditorSectionProps {
  initialHtml?: string;
  onSubmitHtml: (html: string) => Promise<void>;
  isPosting?: boolean;
}

const AnswerEditorSection: React.FC<AnswerEditorSectionProps> = ({
  initialHtml,
  onSubmitHtml,
  isPosting = false,
}) => {
  const editor = useEditor({
    extensions: [
      ...createQnaEditorExtensions({
        placeholder: "Write your answer...",
      }),
    ],
    content: initialHtml ?? "",
    editorProps: {
      attributes: {
        ...getQnaEditorAttributes({
          ariaLabel: "Answer editor",
        }),
      },
    },
  });

  useEffect(() => {
    if (editor && typeof initialHtml === "string") {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
  }, [editor, initialHtml]);

  const plainTextLength = (html: string): number => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    const text = tmp.textContent || tmp.innerText || "";
    return text.trim().length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    
    const html = editor.getHTML();
    const textLength = plainTextLength(html);
    
    // Validate answer content
    if (textLength < 10) {
      toast.error("Answer must contain at least 10 characters of text.");
      return;
    }
    
    if (textLength > 50000) {
      toast.error("Answer must not exceed 50,000 characters.");
      return;
    }
    
    await onSubmitHtml(html);
    editor.commands.clearContent();
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Your Answer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPosting}
            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg"
          >
            {isPosting ? "Posting..." : "Post answer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerEditorSection;
