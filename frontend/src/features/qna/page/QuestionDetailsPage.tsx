import type React from "react";
import { useEffect, useState } from "react";
import { parseDate,timeAgo } from "../../../shared/utils/dateUtils";
import {
  MdShare,
  MdRemoveRedEye as MdEye,
  MdFormatBold,
  MdFormatItalic,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLink,
  MdImage,
} from "react-icons/md";
import Header from "../../../shared/ui/Header";
import Sidebar from "../components/SideBar";
import Footer from "../../../shared/ui/Footer";
import {  useParams } from "react-router-dom";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

interface Question {
  id: string;
  title: string;
  descriptionHtml: string;
  votes: number;
  askedBy: string
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  bookmarked: boolean;
}


interface RelatedQuestion {
  id: string;
  title: string;
  votes: number;
  answers: number;
  views: number;
  tags: string[];
}

const QuestionDetailsPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [loading,setLoading] = useState(false);
  const [relatedQuestions,setRelatedQuestions] = useState<RelatedQuestion[]>([]);
  
  const author = {
    name: "John Developer",
    reputation: 2450,
    avatar: undefined,
  };
  
  const [answerText, setAnswerText] = useState("");
  const [editorFocused, setEditorFocused] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const created = parseDate(question?.createdAt);
  const updated = parseDate(question?.updatedAt)

  useEffect(() => {
    if (!questionId) return;
    let cancelled = false;

    async function fetchQuestion(id: string) {
      try {
        setLoading(true);
        const response = await QnAService.getQuestion(id);
        const realtedQuestionResponse = await QnAService.relatedQuestions(id);
        if (cancelled) return;
        setQuestion(response.data);
        setRelatedQuestions(realtedQuestionResponse.data)
      } catch (error) {
        if(error instanceof BaseError) {
          toast.error(error.message);
        }
      }finally{
        if (!cancelled) setLoading(false);
      }
    }

    fetchQuestion(questionId);

    return () => {
      cancelled = true;
    }
  },[questionId]);

  const editorTools = [
    { icon: MdFormatBold, label: "Bold", shortcut: "Ctrl+B" },
    { icon: MdFormatItalic, label: "Italic", shortcut: "Ctrl+I" },
    { icon: MdCode, label: "Code", shortcut: "Ctrl+`" },
    { icon: MdFormatListBulleted, label: "Bullet List" },
    { icon: MdFormatListNumbered, label: "Numbered List" },
    { icon: MdLink, label: "Link" },
    { icon: MdImage, label: "Image" },
  ];

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Answer posted:", answerText);
    setAnswerText("");
  };
  if(loading)
    return  <p>Loading....</p> 
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-8 py-8 ml-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8">
              {  question &&<div className="flex gap-6 mb-4">
                  <div className="flex flex-col items-center gap-4 py-2">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 text-zinc-400 hover:text-purple-400 transition-all group">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                    </button>

                    <span className="text-lg font-semibold text-white w-8 text-center">
                      {question.votes}
                    </span>

                    <button className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 text-zinc-400 hover:text-purple-400 transition-all group">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17 10l-5 5-5-5z" />
                      </svg>
                    </button>


                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 transition-all">
                      <MdShare size={18} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                      {question.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6 pb-6 border-b border-zinc-800/50">
                      <span className="flex items-center gap-1">
                        asked {timeAgo(created)}
                      </span>
                      <span>modified {timeAgo(updated)}</span>
                      <span className="flex items-center gap-1">
                        <MdEye size={16} />
                        {question.views} views
                      </span>
                    </div>

                    <div className="mb-6 p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                      <p className="text-zinc-200 whitespace-pre-wrap text-base leading-relaxed">
                        {question.descriptionHtml}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium hover:bg-blue-500/20 transition-all cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end mt-4">
                      <div className="flex flex-col items-center text-right">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-2">
                          <span className="text-white font-semibold text-sm">
                            {author.name.charAt(0)}
                          </span>
                        </div>

                        <p className="text-sm text-white font-semibold leading-tight">
                          {question.askedBy}
                        </p>

                        <p className="text-xs text-zinc-400">
                          {author.reputation} reputation
                        </p>

                        <p className="text-xs text-zinc-400 mb-1">
                          asked {timeAgo(created)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>}

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Your Answer
                  </h2>

                  <form onSubmit={handlePostAnswer} className="space-y-4">
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
                      onChange={(e) => setAnswerText(e.target.value)}
                      onFocus={() => setEditorFocused(true)}
                      onBlur={() => setEditorFocused(false)}
                      placeholder="Share your answer here..."
                      className={`w-full h-48 px-4 py-3 rounded-b-lg bg-zinc-900/50 border border-t-0 border-zinc-800 text-white placeholder-gray-500 font-mono text-sm transition-all duration-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none ${
                        editorFocused
                          ? "border-purple-500/50"
                          : "hover:border-zinc-700"
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
              </div>
            </div>

            <aside className="w-full lg:w-80 shrink-0">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Related Questions
                </h2>
                <div className="space-y-3">
                  {relatedQuestions.map((relQ) => (
                    <div
                      key={relQ.id}
                      className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer"
                    >
                      <h3 className="text-base font-semibold text-blue-400 mb-2 line-clamp-2">
                        {relQ.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">
                            {relQ.votes}
                          </span>
                          <span>votes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">
                            {relQ.answers}
                          </span>
                          <span>answers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">
                            {relQ.views}
                          </span>
                          <span>views</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {relQ.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full py-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all">
                  Load more related questions
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionDetailsPage;
