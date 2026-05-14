import React from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import type { SaveStatus } from '../../hooks/usePrivateNotes';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({ status }) => {
  if (status === 'idle') return null;

  const configs = {
    saving: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: 'Saving...',
      className: 'text-gray-400',
    },
    saved: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      text: 'Saved',
      className: 'text-emerald-400',
    },
    error: {
      icon: <AlertCircle className="w-3 h-3" />,
      text: 'Failed to save',
      className: 'text-red-400',
    },
  };

  const config = configs[status];

  return (
    <span className={`flex items-center gap-1 text-[10px] font-medium ${config.className} transition-all`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export default SaveStatusIndicator;
