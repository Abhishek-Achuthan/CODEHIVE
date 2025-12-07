import type React from "react";
import type { IconType } from "react-icons";
import {
  MdFormatBold,
  MdFormatItalic,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLink,
  MdImage,
} from "react-icons/md";

interface EditorTool {
  icon: IconType;
  label: string;
  shortcut?: string;
}

const editorTools: EditorTool[] = [
  { icon: MdFormatBold, label: "Bold", shortcut: "Ctrl+B" },
  { icon: MdFormatItalic, label: "Italic", shortcut: "Ctrl+I" },
  { icon: MdCode, label: "Code", shortcut: "Ctrl+`" },
  { icon: MdFormatListBulleted, label: "Bullet List" },
  { icon: MdFormatListNumbered, label: "Numbered List" },
  { icon: MdLink, label: "Link" },
  { icon: MdImage, label: "Image" },
];

interface AnswerEditorSectionProps {
  answerText: string;
  editorFocused: boolean;
  onChangeAnswer: (value: string) => void;
  onFocusEditor: () => void;
  onBlurEditor: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const AnswerEditorSection: React.FC<AnswerEditorSectionProps> = ({
  answerText,
  editorFocused,
  onChangeAnswer,
  onFocusEditor,
  onBlurEditor,
  onSubmit,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Your Answer</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-1 p-3 bg-zinc-900/30 border border-zinc-800 rounded-t-lg">
          {editorTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                title={`${tool.label}${
                  tool.shortcut ? ` (${tool.shortcut})` : ""
                }`}
                className="p-2 rounded hover:bg-zinc-800 transition-colors text-gray-400 hover:text-white"
                aria-label={tool.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        <textarea
          value={answerText}
          onChange={(e) => onChangeAnswer(e.target.value)}
          onFocus={onFocusEditor}
          onBlur={onBlurEditor}
          placeholder="Share your answer here..."
          className={`w-full h-48 px-4 py-3 rounded-b-lg bg-zinc-900/50 border border-t-0 border-zinc-800 text-white placeholder-gray-500 font-mono text-sm transition-all duration-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none ${
            editorFocused ? "border-purple-500/50" : "hover:border-zinc-700"
          }`}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Post answer
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 text-center text-zinc-400 text-sm">
          Existing answers section - connect to API
        </div>
      </div>
    </div>
  );
};
