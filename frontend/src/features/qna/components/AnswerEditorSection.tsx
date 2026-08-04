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
    <div className="mt-16">
      <h2 className="text-xl font-semibold text-zinc-100 mb-6">Your Answer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

          <EditorContent editor={editor} className="p-4 min-h-[200px] text-zinc-200 prose prose-invert max-w-none prose-sm" />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPosting}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? "Posting..." : "Post Your Answer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerEditorSection;
