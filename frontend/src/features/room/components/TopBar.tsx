
import React from 'react';
import { Mic, Video, LogOut, Settings, Monitor, Share2 } from 'lucide-react';

interface TopBarProps {
  roomName: string;
  onLeave: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ roomName, onLeave }) => {
  return (
    <header className="h-14 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between px-4 text-white">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-1.5 rounded-md">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-100">{roomName}</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Live Collaboration</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#161b22] rounded-lg p-1 mr-2 border border-gray-800">
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400 hover:text-white" title="Mute Mic">
            <Mic className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400 hover:text-white" title="Toggle Video">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400 hover:text-white" title="Screen Share">
            <Monitor className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-700 mx-1"></div>
          <button className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400 hover:text-white" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
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
