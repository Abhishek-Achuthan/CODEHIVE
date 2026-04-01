import type * as React from "react";
import { useMemo } from "react";
import { htmlToPlainText } from "../util/htmlToPlainText";

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
      className="group relative border border-zinc-800 hover:border-indigo-500/50 bg-zinc-900/50 hover:bg-zinc-800/60 backdrop-blur-xl rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:-translate-y-0.5" 
      onClick={onclick}
    >
      {actions ? (
        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      ) : null}
      
      <div className="flex gap-5">
        <div className="flex flex-col items-center justify-start gap-1.5 min-w-[80px] pt-1">
          <div className="flex flex-col items-center justify-center w-full py-1 text-gray-400">
            <span className="text-base font-semibold text-gray-300">{voteCount}</span>
            <span className="text-xs font-medium">votes</span>
          </div>
          
          <div className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg border transition-all duration-300 ${
            answerCount > 0 
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
              : "text-gray-500 border-transparent"
          }`}>
            <span className="text-base font-semibold">{answerCount}</span>
            <span className="text-xs font-medium">answers</span>
          </div>
          
          <div className="flex flex-col items-center justify-center w-full py-1 text-gray-500">
            <span className="text-sm font-semibold">{views}</span>
            <span className="text-xs font-medium">views</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-10">
          <h3 className="text-lg font-semibold text-indigo-400 group-hover:text-indigo-300 mb-2.5 line-clamp-1 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-400/90 mb-4 line-clamp-2 leading-relaxed">
            {previousText}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-md text-xs font-medium transition-colors border border-indigo-500/20 hover:border-indigo-500/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
