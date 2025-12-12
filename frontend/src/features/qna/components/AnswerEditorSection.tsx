import React, { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { IconType } from "react-icons";
import { MdFormatBold, MdFormatItalic, MdCode } from "react-icons/md";
import toast from "react-hot-toast";

interface AnswerEditorSectionProps {
  initialHtml?: string;
  onSubmitHtml: (html: string) => Promise<void>;
  isPosting?: boolean;
}

interface EditorTool {
  icon: IconType;
  label: string;
  command: (editor: Editor | null) => void;
  shortcut?: string;
}

const AnswerEditorSection: React.FC<AnswerEditorSectionProps> = ({
  initialHtml,
  onSubmitHtml,
  isPosting = false,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHtml ?? "",
    editorProps: {
      attributes: {
        // add whitespace/word-break utilities so long single words wrap,
        // but keep prose styles for formatting
        class:
          "prose prose-invert max-w-full focus:outline-none min-h-[160px] p-4 text-sm whitespace-pre-wrap break-words",
      },
    },
  });

  useEffect(() => {
    if (editor && typeof initialHtml === "string") {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
  }, [editor, initialHtml]);

  const tools: EditorTool[] = [
    {
      icon: MdFormatBold,
      label: "Bold",
      command: (ed) => ed?.chain().focus().toggleBold().run(),
      shortcut: "Ctrl+B",
    },
    {
      icon: MdFormatItalic,
      label: "Italic",
      command: (ed) => ed?.chain().focus().toggleItalic().run(),
      shortcut: "Ctrl+I",
    },
    {
      icon: MdCode,
      label: "Inline Code",
      command: (ed) => ed?.chain().focus().toggleCode().run(),
      shortcut: "Ctrl+`",
    },
  ];

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
        <div className="flex flex-wrap gap-1 p-3 bg-zinc-900/30 border border-zinc-800 rounded-t-lg">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
                className="p-2 rounded hover:bg-zinc-800 transition-colors text-gray-400 hover:text-white"
                onClick={() => tool.command(editor)}
                aria-label={tool.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        {/* Constrain editor height and allow scrolling for long content.
            'max-h-[40vh]' keeps it reasonable; adjust to taste. */}
        <div className="border border-t-0 border-zinc-800 rounded-b-lg bg-zinc-900/50">
          <div className="max-h-[40vh] min-h-[160px] overflow-auto">
            {/* EditorContent inherits the editorProps.class above.
                Additional wrapper classes force wrapping of long words. */}
            <div className="px-4 py-2 whitespace-pre-wrap break-all">
              <EditorContent editor={editor} />
            </div>
          </div>
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
