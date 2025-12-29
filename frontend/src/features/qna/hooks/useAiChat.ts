import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import type {
  AiAssistResponse,
  AiChatMessageAPI,
  AiChatSessionAPI,
} from "../../../shared/types/api/qna";

function getErrorLabel(err: unknown, fallback: string): string {
  if (err instanceof BaseError) {
    const suffix = typeof err.status === "number" ? ` (${err.status})` : "";
    return `${err.message}${suffix}`;
  }
  if (err instanceof Error) {
    return err.message || fallback;
  }
  return fallback;
}

type UseAiChatState = {
  sessions: AiChatSessionAPI[];
  sessionTitles: Record<string, string>;
  selectedSessionId: string | null;
  messages: AiChatMessageAPI[];
  sessionsLoading: boolean;
  messagesLoading: boolean;
  sending: boolean;
};

type UseAiChatActions = {
  refreshSessions: () => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  newChat: () => Promise<void>;
  sendMessage: (prompt: string) => Promise<void>;
};

export function useAiChat(): UseAiChatState & { actions: UseAiChatActions } {
  const [sessions, setSessions] = useState<AiChatSessionAPI[]>([]);
  const [sessionTitles, setSessionTitles] = useState<Record<string, string>>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiChatMessageAPI[]>([]);

  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const buildTitleFromMessages = (msgs: AiChatMessageAPI[]): string | null => {
    // API returns newest-first; use the oldest user message we have.
    for (let i = msgs.length - 1; i >= 0; i -= 1) {
      const m = msgs[i];
      if (m.role !== "user") continue;
      if (!m.content || m.content.trim().length === 0) continue;

      const firstLine = m.content.split("\n")[0] ?? "";
      const compact = firstLine.replace(/\s+/g, " ").trim();
      return compact.length > 0 ? compact.slice(0, 48) : null;
    }

    return null;
  };

  const refreshSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      // Backend is sorted by updatedAt. Fetch more to skip legacy empty sessions,
      // but stop as soon as we have 10 non-empty sessions.
      const data = await QnAService.listAiChatSessions(50);
      const raw = Array.isArray(data) ? data : [];

      const titles: Record<string, string> = {};
      const nonEmpty: AiChatSessionAPI[] = [];

      for (const s of raw) {
        if (nonEmpty.length >= 10) break;
        try {
          const msgs = await QnAService.getAiChatMessages(s.id, 10);
          if (!Array.isArray(msgs) || msgs.length === 0) continue;

          const t = buildTitleFromMessages(msgs);
          titles[s.id] = t ?? "Chat";
          nonEmpty.push(s);
        } catch {
          // Skip silently
        }
      }

      setSessions(nonEmpty);
      setSessionTitles((prev) => ({ ...prev, ...titles }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("AI chat: failed to load sessions", err);
      setSessions([]);
      toast.error(getErrorLabel(err, "Failed to load chats"));
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    setMessagesLoading(true);
    try {
      const data = await QnAService.getAiChatMessages(sessionId, 50);
      const list = Array.isArray(data) ? data : [];
      setMessages(list.slice().reverse());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("AI chat: failed to load messages", err);
      setMessages([]);
      toast.error(getErrorLabel(err, "Failed to load messages"));
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const selectSession = useCallback(
    async (sessionId: string) => {
      setSelectedSessionId(sessionId);
      await loadMessages(sessionId);
    },
    [loadMessages]
  );

  const newChat = useCallback(async () => {
    setMessages([]);
    setSelectedSessionId(null);

    // Important: don't create a backend session here.
    // A session will be created automatically on the first message send.
  }, []);

  const sendMessage = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;

      setSending(true);

      const tempUserMessage: AiChatMessageAPI = {
        id: `tmp-user-${Date.now()}`,
        sessionId: selectedSessionId ?? "",
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempUserMessage]);

      try {
        const res: AiAssistResponse = selectedSessionId
          ? await QnAService.aiAssist(trimmed, selectedSessionId)
          : await QnAService.aiAssist(trimmed);

        const assistantMessage: AiChatMessageAPI = {
          id: `tmp-assistant-${Date.now()}`,
          sessionId: res.sessionId,
          role: "assistant",
          content: res.response,
          createdAt: new Date().toISOString(),
        };

        if (!selectedSessionId) {
          setSelectedSessionId(res.sessionId);
        }

        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === tempUserMessage.id ? { ...m, sessionId: res.sessionId } : m
          );
          return [...updated, assistantMessage];
        });

        await refreshSessions();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("AI chat: failed to send message", err);
        toast.error(getErrorLabel(err, "Failed to send message"));
      } finally {
        setSending(false);
      }
    },
    [refreshSessions, selectedSessionId]
  );

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    if (selectedSessionId) {
      loadMessages(selectedSessionId);
    }
  }, [loadMessages, selectedSessionId]);

  const actions: UseAiChatActions = useMemo(
    () => ({
      refreshSessions,
      selectSession,
      newChat,
      sendMessage,
    }),
    [newChat, refreshSessions, selectSession, sendMessage]
  );

  return {
    sessions,
    sessionTitles,
    selectedSessionId,
    messages,
    sessionsLoading,
    messagesLoading,
    sending,
    actions,
  };
}
