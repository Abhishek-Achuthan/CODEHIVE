import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Send } from "lucide-react";
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
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="rounded-2xl border border-zinc-800 bg-black/30 backdrop-blur p-5 min-h-[calc(100vh-220px)] flex flex-col">
              {showEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-white leading-tight">
                      Hi there.
                      <br />
                      What would you like to learn today?
                    </h1>

                    <div className="mt-8 relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask me anything"
                        className="w-full h-40 resize-none rounded-xl border border-zinc-700 bg-black/30 text-white placeholder:text-zinc-500 p-4 pr-12 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={onSend}
                        disabled={!canSend}
                        className="absolute bottom-3 right-3 h-9 w-9 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white flex items-center justify-center"
                        type="button"
                      >
                        <Send size={16} />
                      </button>
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                      By using codehive.ai you agree to our Terms and have read our
                      Privacy policy.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto space-y-4 pr-1">
                    {controller.messagesLoading ? (
                      <div className="text-zinc-500">Loading messages…</div>
                    ) : (
                      controller.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                              m.role === "user"
                                ? "bg-zinc-900 border-zinc-700 text-white"
                                : "bg-purple-500/10 border-purple-500/30 text-zinc-100"
                            }`}
                          >
                            {m.role === "assistant" ? (
                              <MarkdownMessage content={m.content} />
                            ) : (
                              m.content
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask me anything"
                        className="w-full h-24 resize-none rounded-xl border border-zinc-700 bg-black/30 text-white placeholder:text-zinc-500 p-4 pr-12 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
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
                        className="absolute bottom-3 right-3 h-9 w-9 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white flex items-center justify-center"
                        type="button"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-zinc-500">
                        Press Enter to send, Shift+Enter for new line
                      </p>
                      {controller.sending && (
                        <p className="text-xs text-zinc-500">Thinking…</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex w-72 shrink-0">
            <div className="w-full rounded-2xl border border-zinc-800 bg-black/40 backdrop-blur p-4 h-[calc(100vh-220px)] flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-200">Recent chats</h2>
                <button
                  onClick={controller.actions.newChat}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-medium"
                  type="button"
                >
                  <Plus size={16} />
                  New
                </button>
              </div>
              {controller.sessionsLoading ? (
                <div className="text-zinc-500 text-sm">Loading…</div>
              ) : controller.sessions.length === 0 ? (
                <div className="text-zinc-500 text-sm">No chats yet.</div>
              ) : (
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-2 pr-1">
                  {controller.sessions.map((s) => {
                    const active = controller.selectedSessionId === s.id;
                    const title = getSessionTitle(controller.sessionTitles[s.id]);

                    return (
                      <button
                        key={s.id}
                        onClick={() => controller.actions.selectSession(s.id)}
                        className={`w-full text-left px-3 py-3 rounded-xl border transition-colors ${
                          active
                            ? "border-purple-500/50 bg-purple-500/10 text-white"
                            : "border-zinc-800 bg-black/20 text-zinc-300 hover:bg-zinc-900"
                        }`}
                        type="button"
                      >
                        <div className="text-sm font-medium truncate">{title}</div>
                        <div className="text-xs text-zinc-500 truncate">
                          {formatSessionLabel(s.updatedAt)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </QnaLayout>
  );
}
