import React from 'react';
import { Video, LogOut, Share2, Info, Mic, MicOff, Camera, CameraOff, MonitorUp, PhoneOff } from 'lucide-react';
import { useRoomAuthorization } from '../authorization/RoomAuthorizationContext';
import { RoomInviteShare } from './RoomInviteShare';

interface TopBarProps {
  roomName?: string;
  roomId: string;
  showInviteControls?: boolean;
  showEndRoomControl?: boolean;
  showReviewButton?: boolean;
  hasReviewed?: boolean;
  onReviewClick?: () => void;
  onOpenSettings?: () => void;
  onEndRoom?: () => void;
  onLeave: () => void;
  isVideoActive?: boolean;
  onToggleVideo?: () => void;
  hasActiveVideoCall?: boolean;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isScreenSharing?: boolean;
  onToggleAudio?: () => void;
  onToggleCamera?: () => void;
  onToggleScreenShare?: () => void;
  onLeaveVideo?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  roomName,
  roomId,
  showInviteControls = false,
  showEndRoomControl = false,
  showReviewButton = false,
  hasReviewed = false,
  onReviewClick,
  onOpenSettings,
  onEndRoom,
  onLeave,
  isVideoActive = false,
  hasActiveVideoCall = false,
  onToggleVideo,
  isAudioMuted = false,
  isVideoMuted = false,
  isScreenSharing = false,
  onToggleAudio,
  onToggleCamera,
  onToggleScreenShare,
  onLeaveVideo,
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
          
          <div className="relative">
            <button
              type="button"
              onClick={onToggleVideo}
              className={`p-1.5 rounded-md transition-colors ${
                isVideoActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={isVideoActive ? "Return to Video Meeting" : "Join Video Meeting"}
            >
              <Video className="w-4 h-4" />
            </button>
            {!isVideoActive && hasActiveVideoCall && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#161b22] rounded-full shadow-sm animate-pulse"></span>
            )}
          </div>
          
          {/* Native Video Controls (always visible, disabled if not active) */}
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button
            type="button"
            onClick={onToggleAudio}
            disabled={!isVideoActive}
            className={`p-1.5 rounded-md transition-colors ${!isVideoActive ? 'text-gray-700 cursor-not-allowed' : isAudioMuted ? 'text-red-400 hover:bg-red-400/10' : 'text-gray-300 hover:bg-gray-700'}`}
            title={!isVideoActive ? 'Not in meeting' : isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onToggleCamera}
            disabled={!isVideoActive}
            className={`p-1.5 rounded-md transition-colors ${!isVideoActive ? 'text-gray-700 cursor-not-allowed' : isVideoMuted ? 'text-red-400 hover:bg-red-400/10' : 'text-gray-300 hover:bg-gray-700'}`}
            title={!isVideoActive ? 'Not in meeting' : isVideoMuted ? "Start Camera" : "Stop Camera"}
          >
            {isVideoMuted ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onToggleScreenShare}
            disabled={!isVideoActive}
            className={`p-1.5 rounded-md transition-colors ${!isVideoActive ? 'text-gray-700 cursor-not-allowed' : isScreenSharing ? 'bg-green-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-700'}`}
            title={!isVideoActive ? 'Not in meeting' : isScreenSharing ? "Stop Screen Share" : "Share Screen"}
          >
            <MonitorUp className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button
            type="button"
            onClick={onLeaveVideo}
            disabled={!isVideoActive}
            className={`p-1.5 rounded-md transition-colors ${!isVideoActive ? 'text-gray-700 cursor-not-allowed' : 'text-red-400 hover:bg-red-500/20'}`}
            title={!isVideoActive ? 'Not in meeting' : 'Leave Meeting'}
          >
            <PhoneOff className="w-4 h-4" />
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
        
        {showReviewButton && (
          <button
            type="button"
            onClick={onReviewClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
          >
            <span>{hasReviewed ? 'View Review' : 'Add Review'}</span>
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
