import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Send, MessageSquare } from "lucide-react";
import QnaLayout from "../../../layouts/QnaLayout";
import { useAiChat } from "../hooks/useAiChat";
import { MarkdownMessage } from "../components/MarkdownMessage";

function formatSessionLabel(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    const date = d.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  } catch {
    return "Chat";
  }
}

function getSessionTitle(title: string | undefined): string {
  const t = (title ?? "").trim();
  return t.length > 0 ? t : "New chat";
}

export default function AiAssistPage() {
  const controller = useAiChat();
  const [prompt, setPrompt] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const showEmpty = controller.messages.length === 0 && !controller.messagesLoading;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [controller.messages.length]);

  const canSend = useMemo(() => {
    return prompt.trim().length > 0 && !controller.sending;
  }, [controller.sending, prompt]);

  const onSend = async () => {
    if (!canSend) return;
    const p = prompt;
    setPrompt("");
    await controller.actions.sendMessage(p);
  };

  return (
    <QnaLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)]">
        <div className="flex gap-6 h-full">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col w-72 shrink-0 bg-[#121214] rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Conversations
              </h2>
              <button
                onClick={controller.actions.newChat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium transition-colors"
                type="button"
              >
                <Plus size={14} />
                New Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {controller.sessionsLoading ? (
                <div className="text-zinc-500 text-sm text-center py-4">Loading…</div>
              ) : controller.sessions.length === 0 ? (
                <div className="text-zinc-500 text-sm text-center py-4">No chats yet.</div>
              ) : (
                controller.sessions.map((s) => {
                  const active = controller.selectedSessionId === s.id;
                  const title = getSessionTitle(controller.sessionTitles[s.id]);

                  return (
                    <button
                      key={s.id}
                      onClick={() => controller.actions.selectSession(s.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${active
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                        }`}
                      type="button"
                    >
                      <div className="text-sm font-medium truncate mb-1">{title}</div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {formatSessionLabel(s.updatedAt)}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-[#121214] rounded-2xl border border-zinc-800 overflow-hidden relative">
            {showEmpty ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl w-full text-center">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                    <MessageSquare className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-zinc-100 mb-2">
                    How can I help you today?
                  </h1>
                  <p className="text-zinc-400 text-sm mb-8">
                    Ask a technical question, paste some code, or request an explanation.
                  </p>

                  <div className="relative text-left">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Message AI Assist..."
                      className="w-full h-32 resize-none rounded-xl border border-zinc-800 bg-[#18181b] text-zinc-100 placeholder:text-zinc-500 p-4 pr-14 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSend();
                        }
                      }}
                    />
                    <button
                      onClick={onSend}
                      disabled={!canSend}
                      className="absolute bottom-3 right-3 h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-zinc-800 text-white flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {controller.messagesLoading ? (
                    <div className="text-zinc-500 text-center py-4">Loading messages…</div>
                  ) : (
                    controller.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${m.role === "user"
                            ? "bg-zinc-800 text-zinc-100"
                            : "bg-[#18181b] border border-zinc-800 text-zinc-300"
                            }`}
                        >
                          {m.role === "assistant" ? (
                            <div className="prose prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border-zinc-800">
                              <MarkdownMessage content={m.content} />
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{m.content}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} className="h-4" />
                </div>

                <div className="p-4 bg-[#121214] border-t border-zinc-800">
                  <div className="max-w-4xl mx-auto relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Message AI Assist..."
                      className="w-full h-[60px] max-h-32 resize-none rounded-xl border border-zinc-800 bg-[#18181b] text-zinc-100 placeholder:text-zinc-500 px-4 py-3 pr-14 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSend();
                        }
                      }}
                    />
                    <button
                      onClick={onSend}
                      disabled={!canSend}
                      className="absolute bottom-2 right-2 h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-zinc-800 text-white flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-[11px] text-zinc-500">
                      AI Assist can make mistakes. Consider verifying important information.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </QnaLayout>
  );
}
