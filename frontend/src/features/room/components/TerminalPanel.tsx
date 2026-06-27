import React from 'react';
import { Terminal as TerminalIcon, X, CheckCircle, AlertCircle, Clock, Cpu } from 'lucide-react';
import type { CodeExecutionResult } from '../../../api/endpoints/codeAPI';
import { CodeExecutionStatus } from '../../../../../backend/src/domain/types/CodeExecutionResult';

interface TerminalPanelProps {
  result: CodeExecutionResult | null;
  error: string | null;
  isRunning: boolean;
  onClose: () => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ result, error, isRunning, onClose }) => {
  if (!result && !error && !isRunning) return null;

  const isError = error || (result && result.status !== CodeExecutionStatus.ACCEPTED);
  const statusColor = isError ? 'text-red-400' : 'text-green-400';
  const StatusIcon = isError ? AlertCircle : CheckCircle;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-[#0d1117] border-t border-gray-700 flex flex-col z-10 shadow-2xl animate-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <TerminalIcon className="w-4 h-4" />
          <span>Execution Output</span>
          {isRunning && (
            <span className="ml-2 text-xs font-normal text-blue-400 animate-pulse">Running...</span>
          )}
          {!isRunning && (result || error) && (
            <div className={`flex items-center gap-1.5 ml-4 px-2 py-0.5 rounded-md text-xs border ${isError ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} ${statusColor}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{error ? 'Error' : result?.status}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {!isRunning && result && (
            <>
              {result.time && (
                <div className="flex items-center gap-1" title="Execution Time">
                  <Clock className="w-3 h-3" />
                  <span>{result.time}s</span>
                </div>
              )}
              {result.memory != null && (
                <div className="flex items-center gap-1" title="Memory Usage">
                  <Cpu className="w-3 h-3" />
                  <span>{(result.memory / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {isRunning ? (
          <div className="text-gray-500 italic">Waiting for Judge0...</div>
        ) : error ? (
          <div className="text-red-400 whitespace-pre-wrap">{error}</div>
        ) : (
          <>
            {result?.compileOutput && (
              <div className="mb-4">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Compilation Output:</div>
                <div className="text-red-400 whitespace-pre-wrap">{result.compileOutput}</div>
              </div>
            )}
            
            {result?.stderr && (
              <div className="mb-4">
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Standard Error:</div>
                <div className="text-red-400 whitespace-pre-wrap">{result.stderr}</div>
              </div>
            )}
            
            {result?.stdout ? (
              <div>
                <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Standard Output:</div>
                <div className="text-gray-300 whitespace-pre-wrap">{result.stdout}</div>
              </div>
            ) : (!result?.stderr && !result?.compileOutput) ? (
              <div className="text-gray-500 italic">No output produced.</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default TerminalPanel;
