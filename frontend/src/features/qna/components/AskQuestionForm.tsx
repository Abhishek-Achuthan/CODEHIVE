import React, { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdClose } from "react-icons/md";
import QuestionEditor from "./QuestionEditor";
import toast from "react-hot-toast";
import { useCreateQuestion } from "../hooks/useCreateQuestion";
import { BaseError } from "../../../shared/errors/BaseError";

export default function AskQuestionForm(): JSX.Element {
  const navigate = useNavigate();
  const { createQuestion } = useCreateQuestion();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); 
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addTag = (value?: string) => {
    const tag = (value ?? tagInput).trim();
    if (!tag) return;
    if (tags.includes(tag)) {
      setTagInput("");
      return;
    }
    if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }
    setTags((t) => [...t, tag]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags((t) => t.filter((_, i) => i !== index));
  };

  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length) {
      removeTag(tags.length - 1);
    }
  };

  const plainTextLength = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    const text = tmp.textContent || tmp.innerText || "";
    return text.trim().length;
  };

  const validate = (): string | null => {
    if (!title || title.trim().length < 10) return "Title must be at least 10 characters.";
    if (!description || plainTextLength(description) < 20)
      return "Description must be at least 20 characters of text.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return toast.error(v);

    setSubmitting(true);
    try {
      const ok = await createQuestion({
        title,
        contentHtml: description,
        tags,
      });

      if (ok) navigate(`/qna`);
    } catch (error) {
    if(error instanceof BaseError)
       toast.error(error.message ||"Failed to post Question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2.5">
        <label htmlFor="title" className="block text-[15px] font-semibold text-zinc-200">
          Question Title
        </label>
        <p className="text-sm text-zinc-400">Be specific and summarize your question in a single sentence.</p>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What is your problem or question?"
          className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 transition-colors focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
        />
      </div>

      <div className="space-y-2.5">
        <label className="block text-[15px] font-semibold text-zinc-200">Problem Description</label>
        <p className="text-sm text-zinc-400">
          Explain your problem in detail. Include what you tried, what you expected, and any relevant code.
        </p>
        <div className="border border-zinc-800 rounded-lg overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-colors">
          <QuestionEditor value={description} onChange={setDescription} placeholder="Describe your problem..." />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-zinc-500">{plainTextLength(description)} characters</p>
          {plainTextLength(description) > 0 && plainTextLength(description) < 20 && (
            <p className="text-xs text-rose-400">Needs {20 - plainTextLength(description)} more characters</p>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="block text-[15px] font-semibold text-zinc-200">Tags</label>
        <p className="text-sm text-zinc-400">Add up to 5 relevant tags. Press Enter to add a tag.</p>

        <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-colors">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20"
              role="listitem"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-indigo-400 hover:text-indigo-200 transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                <MdClose size={14} />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={onTagKeyDown}
            placeholder={tags.length === 0 ? "e.g. react, typescript, testing..." : ""}
            maxLength={30}
            className="flex-1 min-w-[120px] px-2 py-1 bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex justify-end mt-1">
          <p className="text-xs text-zinc-500">{tags.length}/5 tags used</p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-zinc-800/80">
        <button
          type="submit"
          disabled={submitting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors ${
            submitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <MdAdd size={18} />
          <span>{submitting ? "Posting..." : "Post Question"}</span>
        </button>
      </div>
    </form>
  );
}
