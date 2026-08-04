import type * as React from "react";
import { useMemo } from "react";
import { htmlToPlainText } from "../util/htmlToPlainText";
import { MessageCircle, ThumbsUp, Eye } from "lucide-react";

export interface QuestionCardProps {
  title: string;
  contentHtml: string;
  tags: string[];
  voteCount?: number;
  answerCount?: number;
  views?: number;
  onclick?:()=>void;
  actions?: React.ReactNode;
}


export default function QuestionCard({
  title,
  contentHtml,
  tags = [],
  voteCount = 0,
  answerCount = 0,
  views = 0,
  onclick,
  actions,
}: QuestionCardProps) {

  const previousText = useMemo(() => htmlToPlainText(contentHtml), [contentHtml]);
  
  return (
    <article 
      className="group relative flex flex-col gap-4 border border-zinc-800 hover:border-zinc-700 bg-[#121214] hover:bg-[#18181b] rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" 
      onClick={onclick}
    >
      {actions ? (
        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      ) : null}
      
      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] font-semibold text-zinc-100 group-hover:text-indigo-400 mb-2 line-clamp-1 transition-colors duration-200 pr-12">
          {title}
        </h3>
        <p className="text-sm text-zinc-400/90 mb-4 line-clamp-2 leading-relaxed">
          {previousText}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-md text-xs font-medium border border-zinc-700/50"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-5 mt-auto pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">{voteCount}</span>
            <span className="text-xs">votes</span>
          </div>
          
          <div className={`flex items-center gap-1.5 transition-colors duration-300 ${
            answerCount > 0 
              ? "text-emerald-400" 
              : "text-zinc-400"
          }`}>
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{answerCount}</span>
            <span className="text-xs">answers</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{views}</span>
            <span className="text-xs">views</span>
          </div>
        </div>
      </div>
    </article>
  );
}
