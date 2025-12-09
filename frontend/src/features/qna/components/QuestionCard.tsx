
export interface QuestionCardProps {
  title: string;
  descriptionHtml: string;
  tags: string[];
  votes?: number;
  answers?: number;
  views?: number;
  onclick?:()=>void;
}

export default function QuestionCard({
  title,
  descriptionHtml,
  tags = [],
  votes = 0,
  answers = 0,
  views = 0,
  onclick
}: QuestionCardProps) {
  return (

    <article className="group border border-border/30 hover:border-accent/50 bg-card/40 hover:bg-card/60 rounded-lg p-4 transition-all cursor-pointer " onClick={onclick}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-3 text-xs text-foreground/60 min-w-[72px]">
          <div className="text-center">
            <div className="font-semibold text-foreground">{votes}</div>
            <div>votes</div>
          </div>
          <div className={`text-center ${answers > 0 ? "text-accent" : "text-foreground/60"}`}>
            <div className="font-semibold text-foreground">{answers}</div>
            <div>answers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{views}</div>
            <div>views</div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-accent group-hover:text-accent/90 mb-2 line-clamp-1 transition">
            {title}
          </h3>
          <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{descriptionHtml}</p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-primary/15 hover:bg-primary/25 text-primary rounded text-xs font-medium transition border border-white/30 hover:border-white"
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
