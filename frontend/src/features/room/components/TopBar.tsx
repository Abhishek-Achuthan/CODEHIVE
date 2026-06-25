import React from 'react';
import { Mic, Video, LogOut, Settings, Monitor, Share2 } from 'lucide-react';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomInviteShare } from './RoomInviteShare';

interface TopBarProps {
  roomName: string;
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
  const canUseVideoAudio = authorization.hasFeature('video_audio') && authorization.isActive;
  return (
    <header className="h-14 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between px-4 text-white">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-1.5 rounded-md">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-100">{roomName}</h1>
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
            disabled={!canUseVideoAudio}
            className={`p-2 rounded-md transition-colors ${
              canUseVideoAudio
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-700 cursor-not-allowed'
            }`}
            title={canUseVideoAudio ? 'Mute Mic' : 'Video/audio unavailable'}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            disabled={!canUseVideoAudio}
            className={`p-2 rounded-md transition-colors ${
              canUseVideoAudio
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-700 cursor-not-allowed'
            }`}
            title={canUseVideoAudio ? 'Toggle Video' : 'Video/audio unavailable'}
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            disabled={!authorization.canStartScreenshare}
            className={`p-2 rounded-md transition-colors ${
              authorization.canStartScreenshare
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-700 cursor-not-allowed'
            }`}
            title={authorization.canStartScreenshare ? 'Screen Share' : 'Screen sharing unavailable'}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-md text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="Room settings"
          >
            <Settings className="w-4 h-4" />
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
