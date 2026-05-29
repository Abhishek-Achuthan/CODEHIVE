import React, { Suspense, lazy } from 'react';
import { Lock } from 'lucide-react';
import { WhiteboardProvider } from './WhiteboardProvider';

const TldrawEditor = lazy(() => import('./TldrawEditor'));

interface WhiteboardProps {
  roomId: string;
  user: { userId: string; userName: string };
  canEdit: boolean;
  canCollaborate: boolean;
  lockTitle: string;
  lockDescription: string;
}

const Whiteboard: React.FC<WhiteboardProps> = (props) => {
  if (!props.canCollaborate) {
    return (
      <div className="h-full w-full bg-[#0d1117] flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <Lock className="w-8 h-8 text-gray-600" />
          <div>
            <p className="text-sm font-semibold text-gray-100">{props.lockTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{props.lockDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0d1117]">
      <WhiteboardProvider roomId={props.roomId}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading editor...</p>
            </div>
          </div>
        }>
          <TldrawEditor {...props} />
        </Suspense>
      </WhiteboardProvider>
    </div>
  );
};

export default Whiteboard;
