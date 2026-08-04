import React, { useState, useRef, useEffect } from 'react';
import type { RoomMessage as Message, Participant } from '../types';
import {
  Send,
  Smile,
  MoreHorizontal,
  X,
  Pencil,
  Reply,
} from 'lucide-react';

import { MessageContextMenu } from './MessageContextMenu';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (
    content: string,
    parentMessageId?: string
  ) => void;

  onEditMessage?: (
    messageId: string,
    content: string
  ) => void;

  onDeleteMessage?: (messageId: string) => void;

  onTypingChange: (isTyping: boolean) => void;

  typingUsers: string[];

  currentUser: Participant;

  isRealtimeReady: boolean;

  theme?: 'dark' | 'light';
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onTypingChange,
  typingUsers,
  currentUser,
  isRealtimeReady,
  theme = 'dark',
}) => {
  const authorization = useRoomAuthorization();
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [contextMenuMessageId, setContextMenuMessageId] =
    useState<string | null>(null);

  const [editingMessageId, setEditingMessageId] =
    useState<string | null>(null);

  const [replyingToMessageId, setReplyingToMessageId] =
    useState<string | null>(null);

  // Read more state
  const [expandedMessages, setExpandedMessages] = useState<
    Record<string, number>
  >({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pickerRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, typingUsers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = '0px';

      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${Math.min(
        scrollHeight,
        150
      )}px`;

      textarea.style.overflowY =
        scrollHeight > 150 ? 'auto' : 'hidden';
    }
  }, [inputValue]);

  const handleSubmit = (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    if (!isRealtimeReady) {
      return;
    }

    if (editingMessageId && onEditMessage) {
      onEditMessage(
        editingMessageId,
        inputValue.trim()
      );

      setEditingMessageId(null);
    } else {
      onSendMessage(
        inputValue.trim(),
        replyingToMessageId || undefined
      );

      setReplyingToMessageId(null);
    }

    setInputValue('');

    onTypingChange(false);

    setShowEmojiPicker(false);
  };

  const handleCopy = async (
    content: string
  ) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error(
        'Failed to copy text',
        error
      );
    }
  };

  const handleEditInit = (
    msg: Message
  ) => {
    setReplyingToMessageId(null);

    setEditingMessageId(msg.id);

    setInputValue(msg.content);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleReplyInit = (
    msg: Message
  ) => {
    setEditingMessageId(null);

    setReplyingToMessageId(msg.id);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const cancelAction = () => {
    setEditingMessageId(null);

    setReplyingToMessageId(null);

    setInputValue('');
  };

  const getMessageById = (
    id: string
  ) => {
    return messages.find(
      (message) => message.id === id
    );
  };

  // Read more helper
  const getVisibleContent = (
    messageId: string,
    content: string
  ) => {
    const lines = content.split('\n');

    const visibleLines =
      expandedMessages[messageId] || 20;

    return {
      text: lines
        .slice(0, visibleLines)
        .join('\n'),

      hasMore:
        lines.length > visibleLines,

      visibleLines,
    };
  };

  return (
    <div
      className={`flex flex-col h-full transition-colors ${
        isDark
          ? 'bg-[#0d1117]'
          : 'bg-white'
      }`}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((m) => {
          const isMe = m.senderId === currentUser.id;
          const canDeleteMessage = isMe
            ? authorization.canDeleteOwnChat && !m.isDeleted
            : authorization.canModerateParticipants && !m.isDeleted;
          const canEditMessage = isMe && authorization.canWriteChat && !m.isDeleted;

          const parentMsg =
            m.parentMessageId
              ? getMessageById(
                  m.parentMessageId
                )
              : null;

          const avatarUrl = isMe
            ? currentUser.avatar
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.senderId}`;

          const messageData = m.isDeleted 
            ? { text: 'This message was deleted.', hasMore: false, visibleLines: 1 }
            : getVisibleContent(
              m.id,
              m.content
            );

          return (
            <div
              key={m.id}
              className={`flex gap-3 group relative ${
                isMe
                  ? 'flex-row-reverse'
                  : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className="shrink-0 mt-auto">
                <div
                  className={`w-8 h-8 rounded-full border-2 overflow-hidden shadow-sm ${
                    isMe
                      ? 'border-blue-600/50'
                      : 'border-gray-800'
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt={m.senderName}
                    className="w-full h-full object-cover bg-gray-800"
                  />
                </div>
              </div>

              {/* Message Wrapper */}
              <div
                className={`flex flex-col max-w-[75%] min-w-0 relative ${
                  isMe
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                {/* Header */}
                <div
                  className={`flex items-center gap-2 mb-1 px-1 ${
                    isMe
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tight ${
                      isMe
                        ? 'text-blue-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {isMe
                      ? 'You'
                      : m.senderName}
                  </span>

                  <span className="text-[9px] text-gray-600">
                    {m.timestamp}
                  </span>
                </div>

                {/* Reply Preview */}
                {parentMsg && (
                  <div
                    className={`flex items-center gap-2 mb-1 opacity-70 text-xs px-2 ${
                      isMe
                        ? 'flex-row-reverse text-right'
                        : 'flex-row text-left'
                    }`}
                  >
                    <Reply className="w-3 h-3 text-gray-500 shrink-0" />

                    <span className="text-gray-400 font-medium">
                      Replying to{' '}
                      {parentMsg.senderName}
                    </span>

                    <span className="text-gray-500 truncate max-w-[150px]">
                      {parentMsg.content}
                    </span>
                  </div>
                )}

                {/* Bubble Area */}
               <div className="relative flex items-start group/bubble">
                  {/* Menu Trigger */}
                  {!m.isDeleted && (
                    isMe ? (
                      <div className="absolute top-0 -left-8 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setContextMenuMessageId(
                              m.id
                            )
                          }
                          className="p-1 text-gray-500 hover:text-gray-300 rounded hover:bg-[#3e3e42]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="absolute top-0 -right-8 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setContextMenuMessageId(
                              m.id
                            )
                          }
                          className="p-1 text-gray-500 hover:text-gray-300 rounded hover:bg-[#3e3e42]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}

                  {/* Context Menu */}
                  {contextMenuMessageId ===
                    m.id && (
                    <MessageContextMenu
                      canEdit={canEditMessage}
                      canDelete={canDeleteMessage}
                      onEdit={() => {
                        handleEditInit(m);

                        setContextMenuMessageId(
                          null
                        );
                      }}
                      onDelete={() => {
                        onDeleteMessage?.(
                          m.id
                        );

                        setContextMenuMessageId(
                          null
                        );
                      }}
                      onCopy={() => {
                        handleCopy(
                          m.content
                        );

                        setContextMenuMessageId(
                          null
                        );
                      }}
                      onReply={() => {
                        handleReplyInit(m);

                        setContextMenuMessageId(
                          null
                        );
                      }}
                      onClose={() =>
                        setContextMenuMessageId(
                          null
                        )
                      }
                    />
                  )}

                  {/* Chat Bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words break-all w-fit max-w-full shadow-sm transition-all flex flex-col ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none border border-blue-500 shadow-blue-500/10'
                        : isDark
                        ? 'bg-[#161b22] text-gray-200 rounded-bl-none border border-gray-800'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className={`whitespace-pre-wrap break-words break-all leading-6 ${m.isDeleted ? 'italic text-gray-500' : ''}`}>
                      {messageData.text}
                    </p>

                    {messageData.hasMore && (
                      <button
                        onClick={() =>
                          setExpandedMessages(
                            (
                              prev
                            ) => ({
                              ...prev,
                              [m.id]:
                                messageData.visibleLines +
                                20,
                            })
                          )
                        }
                        className="mt-2 text-xs font-medium text-blue-300 hover:underline self-start"
                      >
                        Read more
                      </button>
                    )}

                    {m.isEdited && (
                      <span className="text-[10px] opacity-60 mt-1 text-right italic select-none">
                        (edited)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-3 px-2">
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />

              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />

              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
            </div>

            <span className="text-[10px] text-gray-500 font-medium italic">
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : 'Several people are typing...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className={`px-3 py-3 border-t relative flex flex-col gap-2 ${
          isDark
            ? 'border-gray-800'
            : 'border-gray-200'
        }`}
      >
        {(editingMessageId ||
          replyingToMessageId) && (
          <div className="flex items-center justify-between text-xs text-gray-400 bg-[#161b22] px-3 py-1.5 rounded-t-xl border border-b-0 border-gray-800">
            <div className="flex items-center gap-2">
              {editingMessageId ? (
                <Pencil className="w-3 h-3" />
              ) : (
                <Reply className="w-3 h-3" />
              )}

              <span className="font-medium text-gray-300">
                {editingMessageId
                  ? 'Editing message'
                  : `Replying to ${
                      getMessageById(
                        replyingToMessageId!
                      )?.senderName ||
                      'message'
                    }`}
              </span>
            </div>

            <button
              onClick={cancelAction}
              className="hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`flex items-end gap-2 border px-2 py-1.5 transition-all ${
              editingMessageId ||
              replyingToMessageId
                ? 'rounded-b-xl rounded-t-none'
                : 'rounded-xl'
            } ${
              isDark
                ? 'bg-[#161b22] border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() =>
                setShowEmojiPicker(
                  !showEmojiPicker
                )
              }
              className={`p-1.5 rounded-lg self-end transition-colors ${
                showEmojiPicker
                  ? 'text-blue-500'
                  : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              <Smile className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(
                  e.target.value
                );

                if (isRealtimeReady) {
                  if (!authorization.canWriteChat) {
                    return;
                  }
                  onTypingChange(
                    e.target.value
                      .length > 0
                  );
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  handleSubmit();
                }
              }}
              placeholder={
                !isRealtimeReady
                  ? 'Reconnecting...'
                  : !authorization.canWriteChat
                  ? authorization.isArchived
                    ? 'This room is archived — chat history is read-only.'
                    : authorization.isScheduled
                      ? 'Chat unlocks when the session starts.'
                      : authorization.isReadonly
                        ? 'This room is read-only — you cannot send new messages.'
                        : 'You do not have permission to chat in this room.'
                  : editingMessageId
                  ? 'Edit your message...'
                  : 'Message team...'
              }
              disabled={!isRealtimeReady || !authorization.canWriteChat}
              rows={1}
              className={`flex-1 bg-transparent border-none text-sm resize-none outline-none focus:ring-0 py-1.5 px-1 ${
                isDark
                  ? 'text-gray-200'
                  : 'text-gray-800'
              }`}
            />

            <button
              type="submit"
              disabled={
                !inputValue.trim() || !isRealtimeReady || !authorization.canWriteChat
              }
              className={`p-2 rounded-lg self-end transition-all ${
                !inputValue.trim() || !isRealtimeReady || !authorization.canWriteChat
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
