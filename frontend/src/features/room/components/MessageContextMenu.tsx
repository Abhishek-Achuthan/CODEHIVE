import React, { useEffect, useRef } from 'react';
import { Pencil, Trash2, Copy, Reply } from 'lucide-react';

interface MessageContextMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy: () => void;
  onReply: () => void;
  onClose: () => void;
  canEditDelete: boolean;
}

export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  onEdit,
  onDelete,
  onCopy,
  onReply,
  onClose,
  canEditDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-6 z-50 w-40 rounded-lg bg-[#252526] shadow-xl border border-[#3e3e42] py-1 text-sm text-gray-300 overflow-hidden"
    >
      <button
        onClick={onReply}
        className="w-full flex items-center px-4 py-2 hover:bg-[#3e3e42] hover:text-white transition-colors"
      >
        <Reply className="w-4 h-4 mr-2" />
        Reply
      </button>

      <button
        onClick={onCopy}
        className="w-full flex items-center px-4 py-2 hover:bg-[#3e3e42] hover:text-white transition-colors"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </button>

      {canEditDelete && (
        <>
          <div className="h-px bg-[#3e3e42] my-1 mx-2" />
          <button
            onClick={onEdit}
            className="w-full flex items-center px-4 py-2 hover:bg-[#3e3e42] hover:text-white transition-colors"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="w-full flex items-center px-4 py-2 hover:bg-red-500/10 hover:text-red-400 text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </>
      )}
    </div>
  );
};
