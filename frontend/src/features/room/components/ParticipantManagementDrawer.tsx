import React, { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { RoomService } from '../../../services/roomService';
import type { Participant } from '../types';


const PERMISSION_TOGGLES = [
  {
    key: 'room.whiteboard.draw',
    label: 'Draw on Whiteboard',
    description: 'Allow editing and drawing.',
  },
  {
    key: 'room.public_notes.edit',
    label: 'Edit Public Notes',
    description: 'Allow editing shared notes.',
  },
  {
    key: 'room.polls.create',
    label: 'Create & Manage Polls',
    description: 'Allow creating and closing polls.',
  },
  {
    key: 'room.screenshare.start',
    label: 'Share Screen',
    description: 'Allow screen sharing.',
  },
];

interface ParticipantManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  participant: Participant | null;
  initialOverrides: Record<string, boolean>;
  onOverridesUpdated: (participantId: string, overrides: Record<string, boolean>) => void;
  onReport: () => void;
  onKick: () => void;
  canKick: boolean;
}

const ParticipantManagementDrawer: React.FC<ParticipantManagementDrawerProps> = ({
  isOpen,
  onClose,
  roomId,
  participant,
  initialOverrides,
  onOverridesUpdated,
  onReport,
  onKick,
  canKick,
}) => {
  const [overrides, setOverrides] = useState<Record<string, boolean>>(initialOverrides);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOverrides(initialOverrides);
  }, [initialOverrides, participant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close. Wait, if we use a backdrop, onClick on backdrop is enough.
  // But let's use a safe backdrop click.

  const handleToggle = async (key: string, currentValue: boolean | undefined) => {
    if (!participant) return;
    const newValue = !(currentValue ?? false);
    setSaving(key);
    setError(null);

    try {
      const result = await RoomService.updateParticipantOverrides(
        roomId,
        participant.id,
        { [key]: newValue },
      );
      setOverrides(result.overrides);
      onOverridesUpdated(participant.id, result.overrides);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update permission';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(null);
    }
  };

  if (!participant) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-150 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#0d1117] border-l border-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-250 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-12 h-12 rounded-full bg-gray-700 object-cover"
              />
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0d1117] ${
                participant.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-100">{participant.name}</h2>
              <span className="text-xs text-gray-400 capitalize">{participant.role === 'HOST' ? 'Host' : participant.status}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Permissions</h3>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              {PERMISSION_TOGGLES.map(({ key, label, description }) => {
                const currentValue = overrides[key];
                const isEnabled = currentValue === true;
                const isSaving = saving === key;

                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-[#161b22] border border-gray-800 rounded-lg">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium text-gray-200">{label}</p>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleToggle(key, currentValue)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                        isSaving
                          ? 'opacity-50 cursor-not-allowed bg-gray-700'
                          : isEnabled
                            ? 'bg-blue-600'
                            : 'bg-gray-700'
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3 h-3 text-white animate-spin mx-auto" />
                      ) : (
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-500/80">Danger Zone</h3>
            <div className="space-y-2">
              <button 
                onClick={() => { onClose(); onReport(); }}
                className="w-full text-left px-4 py-3 bg-[#161b22] hover:bg-gray-800 border border-gray-800 rounded-lg text-sm font-medium text-gray-300 transition-colors"
              >
                Report User
              </button>
              {canKick && (
                <button 
                  onClick={() => { onClose(); onKick(); }}
                  className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-medium text-red-400 transition-colors"
                >
                  Remove From Room
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ParticipantManagementDrawer;
