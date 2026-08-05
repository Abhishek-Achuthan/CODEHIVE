import React from 'react';
import type { NotificationEntity } from '../../../shared/types/api/notifications';
import { useNotifications } from '../hooks/useNotifications';
import { Info, CircleCheck, TriangleAlert, CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationItem: React.FC<{ 
  notification: NotificationEntity;
  onClick: () => void;
}> = ({ notification, onClick }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS': return <CircleCheck size={18} className="text-green-500" />;
      case 'WARNING': return <TriangleAlert size={18} className="text-yellow-500" />;
      case 'ERROR': return <CircleX size={18} className="text-red-500" />;
      case 'INFO': 
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      let targetUrl = notification.actionUrl;
      if (
        targetUrl.startsWith('/qna/') &&
        !targetUrl.startsWith('/qna/question/') &&
        !targetUrl.startsWith('/qna/ask-question') &&
        !targetUrl.startsWith('/qna/my-questions') &&
        !targetUrl.startsWith('/qna/answered-by-me') &&
        !targetUrl.startsWith('/qna/saved') &&
        !targetUrl.startsWith('/qna/ai-assist') &&
        !targetUrl.startsWith('/qna/answers')
      ) {
        const id = targetUrl.replace('/qna/', '');
        if (id) {
          targetUrl = `/qna/question/${id}`;
        }
      }
      navigate(targetUrl);
    }
    
    onClick();
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-4 cursor-pointer hover:bg-gray-800 transition-colors flex gap-3 items-start ${
        !notification.isRead ? 'bg-gray-800/40' : ''
      }`}
    >
      <div className="mt-1 flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-200'}`}>
            {notification.title}
          </p>
          <span className="text-[10px] text-gray-500 flex-shrink-0 whitespace-nowrap mt-1">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {notification.message}
        </p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
      )}
    </div>
  );
};
