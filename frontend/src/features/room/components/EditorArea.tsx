
import React from 'react';
import { FileCode, Play, Terminal, Info, ChevronRight, Search } from 'lucide-react';

const EditorArea: React.FC = () => {
  const mockCode = `// Collaboration Room: Project Alpha
import React, { useState, useEffect } from 'react';

export const MainApp = () => {
  const [status, setStatus] = useState('initializing...');

  useEffect(() => {
    // Connect to room sync service
    connectToSyncService().then(() => {
      setStatus('ready');
    });
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1>Status: {status}</h1>
    </div>
  );
};

// Start collaborating...
`;

  return (
    <main className="flex-1 flex flex-col bg-[#010409] relative overflow-hidden">
      {/* File Explorer Bar (Internal Layout) */}
      <div className="h-10 border-b border-gray-800 flex items-center bg-[#0d1117] px-4 justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1 hover:text-white cursor-pointer">
            <span>src</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5 bg-[#161b22] px-3 py-1 rounded-t-md text-blue-400 border-b-2 border-blue-500 -mb-1 mt-1 transition-colors">
            <FileCode className="w-3.5 h-3.5" />
            <span>App.tsx</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1 bg-green-600/20 text-green-500 hover:bg-green-600/30 rounded-md text-xs font-semibold transition-all border border-green-500/20 group">
              <Play className="w-3 h-3 fill-current" />
              <span>Run Code</span>
            </button>
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-auto font-mono text-sm leading-relaxed p-6 group">
        <div className="flex gap-4">
          {/* Line Numbers */}
          <div className="text-gray-600 text-right select-none space-y-0.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          
          {/* Code Text */}
          <pre className="text-gray-300">
            <code>{mockCode}</code>
          </pre>
        </div>
        
        {/* Floating Editor Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-[#161b22]/90 backdrop-blur-md border border-gray-800 p-1.5 rounded-lg shadow-2xl flex items-center gap-1">
            <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-all" title="Room Info">
              <Info className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-all" title="Toggle Terminal">
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Editor Footer / Status Bar */}
      <div className="h-6 border-t border-gray-800 bg-[#0d1117] flex items-center justify-between px-3 text-[10px] text-gray-500 uppercase tracking-tight">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
            <span>TypeScript JSX</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Line 14, Column 22</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </main>
  );
};

export default EditorArea;
