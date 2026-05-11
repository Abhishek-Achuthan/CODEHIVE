import React from 'react';
import {
  FileCode,
  Play,
  Terminal,
  Info,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import CollaborativeEditor from './CollaborativeEditor';

const EditorArea: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <div className="text-white p-4">Invalid room</div>;
  }

  return (
    <main className="flex-1 flex flex-col bg-[#010409] relative overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-gray-800 flex items-center bg-[#0d1117] px-4 justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1 hover:text-white cursor-pointer">
            <span>src</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5 bg-[#161b22] px-3 py-1 rounded-t-md text-blue-400 border-b-2 border-blue-500 -mb-1 mt-1">
            <FileCode className="w-3.5 h-3.5" />
            <span>App.tsx</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1 bg-green-600/20 text-green-500 hover:bg-green-600/30 rounded-md text-xs font-semibold border border-green-500/20">
            <Play className="w-3 h-3 fill-current" />
            <span>Run Code</span>
          </button>

          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-hidden group">
        <CollaborativeEditor roomId={roomId} />

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-[#161b22]/90 border border-gray-800 p-1.5 rounded-lg shadow-2xl flex items-center gap-1">
            <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white">
              <Info className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white">
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-6 border-t border-gray-800 bg-[#0d1117] flex items-center justify-between px-3 text-[10px] text-gray-500 uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            UTF-8
          </span>
          <span>TypeScript JSX</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Line 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </main>
  );
};

export default EditorArea;