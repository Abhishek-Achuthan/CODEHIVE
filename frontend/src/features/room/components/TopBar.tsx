import React from 'react';
import { Video, LogOut, Share2, Info } from 'lucide-react';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomInviteShare } from './RoomInviteShare';

interface TopBarProps {
  roomName?: string;
  roomId: string;
  showInviteControls?: boolean;
  showEndRoomControl?: boolean;
  onOpenSettings?: () => void;
  onEndRoom?: () => void;
  onLeave: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  roomName,
  roomId,
  showInviteControls = false,
  showEndRoomControl = false,
  onOpenSettings,
  onEndRoom,
  onLeave,
}) => {
  const authorization = useRoomAuthorization();
  return (
    <header className="h-14 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between px-4 text-white">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-1.5 rounded-md">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          {roomName ? (
            <h1 className="text-sm font-semibold text-gray-100">{roomName}</h1>
          ) : (
            <div className="h-5 w-48 bg-gray-800/80 rounded animate-pulse mb-0.5" />
          )}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${authorization.isActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              {authorization.lifecycleLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showInviteControls && <RoomInviteShare roomId={roomId} />}
        <div className="flex items-center bg-[#161b22] rounded-lg p-1 mr-2 border border-gray-800">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 p-1.5 px-3 rounded-md text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Room Details"
          >
            <Info className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Details</span>
          </button>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button
            disabled={true}
            className="p-1.5 rounded-md text-gray-700 cursor-not-allowed transition-colors"
            title="Video calls coming soon"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
        
        {showEndRoomControl && (
          <button
            type="button"
            onClick={onEndRoom}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 rounded-lg text-sm font-medium transition-colors border border-amber-500/20"
          >
            <span>End Room</span>
          </button>
        )}

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Leave Room</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
