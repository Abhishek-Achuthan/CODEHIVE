
import React, { useState, useRef, useEffect } from 'react';
import type { RoomMessage as Message, Participant } from '../types';
import { Send, Smile, Paperclip, MoreHorizontal, User } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  typingUsers: string[];
  currentUser: Participant;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onTypingChange,
  typingUsers,
  currentUser,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onTypingChange(false);
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const typingLabel = (() => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    return `${typingUsers[0]}, ${typingUsers[1]}, and ${typingUsers.length - 2} others are typing...`;
  })();

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => {
          const isMe = message.senderId === currentUser.id;
          
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  {isMe ? 'You' : message.senderName}
                </span>
                <span className="text-[10px] text-gray-600 font-medium">{message.timestamp}</span>
              </div>
              
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500 hover:bg-blue-700'
                    : 'bg-[#161b22] text-gray-200 rounded-tl-none border border-gray-800 hover:border-gray-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator (Mocked) */}
      <div className="px-4 py-1 text-[10px] text-gray-500 font-medium italic min-h-[20px]">
        {typingLabel ? <span className="animate-pulse">{typingLabel}</span> : null}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-[#0d1117]">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-[#161b22] border border-gray-800 rounded-xl p-2 focus-within:border-blue-500/50 transition-all shadow-inner group">
            <div className="flex items-center gap-1 pb-1 pr-1">
              <button type="button" className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              value={inputValue}
              onChange={(e) => {
                const nextValue = e.target.value;
                setInputValue(nextValue);
                onTypingChange(nextValue.trim().length > 0);
              }}
              onBlur={() => onTypingChange(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message team..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-200 resize-none py-1.5 max-h-32 min-h-[36px] placeholder:text-gray-600"
              rows={1}
            />
            
            <div className="flex items-center gap-1 pb-1">
              <button type="button" className="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-all">
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-1.5 rounded-lg transition-all ${
                  inputValue.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-3 text-[10px] text-gray-600 font-medium">
             <span className="flex items-center gap-1 hover:text-gray-400 cursor-pointer"><User className="w-3 h-3"/> Private chat</span>
             <span className="flex items-center gap-1 hover:text-gray-400 cursor-pointer"><MoreHorizontal className="w-3 h-3"/> Options</span>
          </div>
          <span className="text-[10px] text-gray-700 font-mono">Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
