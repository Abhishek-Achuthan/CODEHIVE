import React, { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { MdAdd, MdClose } from "react-icons/md";
import QuestionEditor from "./QuestionEditor";
import { QnAService } from "../../../services/qnaService";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { BaseError } from "../../../shared/errors/BaseError";

export default function AskQuestionForm(): JSX.Element {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth?.user?.id);
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
    if (!userId) {
      toast.error("You must be signed in to post a question.");
      return;
    }

    setSubmitting(true);
    try {
      // Sanitize HTML but allow formatting tags (TipTap uses these)
      const safeHtml = DOMPurify.sanitize(description, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      });

      const payload = {
        title: title.trim(),
        descriptionHtml: safeHtml,
        askedBy: userId,
        tags,
      };
      try {
        await QnAService.createQuestion(payload);
        navigate(`/qna`);
      } catch (error) {
        if(error instanceof BaseError)
        toast.error(error.message)
        return 
      }

    } catch (error) {
      if(error instanceof BaseError)
      toast.error(error.message || 'Failed to post Question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-base font-semibold text-white">
          Title
        </label>
        <p className="text-sm text-gray-400">Be specific and summarize your question in a single sentence.</p>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your problem?"
          className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-base font-semibold text-white">Description</label>
        <p className="text-sm text-gray-400">
          Explain your problem in detail. Include what you tried, what you expected, and any relevant code or
          screenshots.
        </p>

        <QuestionEditor value={description} onChange={setDescription} placeholder="Describe your problem..." />
        <p className="text-xs text-gray-500 mt-1">{plainTextLength(description)} characters</p>
      </div>

      <div className="space-y-2">
        <label className="block text-base font-semibold text-white">Tags</label>
        <p className="text-sm text-gray-400">Add up to 5 relevant tags. Press Enter to add a tag.</p>

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={onTagKeyDown}
          placeholder="Type a tag and press Enter..."
          maxLength={30}
          className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
        />

        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 text-emerald-300 text-sm"
              role="listitem"
            >
              <span className="truncate">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-emerald-200 transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>
        {tags.length > 0 && <p className="text-xs text-gray-500">{tags.length}/5 tags used</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-200 shadow-lg ${
            submitting ? "opacity-60 pointer-events-none" : "hover:scale-[1.02]"
          }`}
        >
          <MdAdd size={18} />
          <span>{submitting ? "Posting..." : "Ask Question"}</span>
        </button>
      </div>
    </form>
  );
}
