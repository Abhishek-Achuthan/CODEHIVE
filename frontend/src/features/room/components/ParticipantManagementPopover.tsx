import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, Pen, FileText, BarChart, Monitor, Flag, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import { RoomService } from '../../../services/roomService';
import type { Participant } from '../types';
import { useOnClickOutside } from '../../../shared/hooks/useOnClickOutside';
import { createPortal } from 'react-dom';

const PERMISSION_TOGGLES = [
  { key: 'room.whiteboard.draw', label: 'Draw on Whiteboard', Icon: Pen },
  { key: 'room.public_notes.edit', label: 'Edit Public Notes', Icon: FileText },
  { key: 'room.polls.create', label: 'Create & Manage Polls', Icon: BarChart },
  { key: 'room.screenshare.start', label: 'Share Screen', Icon: Monitor },
];

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
  roomId: string;
  participant: Participant | null;
  initialOverrides: Record<string, boolean>;
  onOverridesUpdated: (participantId: string, overrides: Record<string, boolean>) => void;
  onReport: () => void;
  onKick: () => void;
  canKick: boolean;
  canManagePermissions?: boolean;
}

const ParticipantManagementPopover: React.FC<PopoverProps> = ({
  isOpen, onClose, anchorRect, roomId, participant, initialOverrides, onOverridesUpdated, onReport, onKick, canKick, canManagePermissions
}) => {
  const [overrides, setOverrides] = useState<Record<string, boolean>>(initialOverrides);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [renderState, setRenderState] = useState<'hidden' | 'entering' | 'entered'>('hidden');

  useEffect(() => {
    setOverrides(initialOverrides);
  }, [initialOverrides, participant]);

  useEffect(() => {
    if (isOpen) {
      setRenderState('entering');
      const timer = requestAnimationFrame(() => {
        setRenderState('entered');
      });
      return () => cancelAnimationFrame(timer);
    } else {
      setRenderState('hidden');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen || !popoverRef.current) return;
      if (popoverRef.current.contains(event.target as Node)) return;
      
      const isClickOnTrigger = (event.target as Element).closest('[data-participant-trigger]');
      if (!isClickOnTrigger) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

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

  if (renderState === 'hidden' || !participant || !anchorRect) return null;

  const left = anchorRect.right + 8;
  const viewportHeight = window.innerHeight;
  let top = anchorRect.top - 16;
  let arrowTop = 26;

  // Estimated max height ~280px (less if no permissions)
  if (top + 280 > viewportHeight) {
    const newTop = Math.max(16, viewportHeight - 300);
    arrowTop += (top - newTop);
    top = newTop;
  }

  const isEntered = renderState === 'entered';

  const content = (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
      }}
      className={`w-[320px] bg-[#12161f] border border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-[16px] flex flex-col origin-top-left transition-all duration-150 ease-out ${
        isEntered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Dynamic Arrow */}
      <div 
        className="absolute w-3 h-3 bg-[#12161f] border-l border-t border-gray-700/50 rounded-tl-[2px]"
        style={{ 
          top: `${arrowTop}px`, 
          left: '-6.5px',
          transform: 'rotate(-45deg)',
          zIndex: 10,
        }}
      />

      <div className="p-5 flex flex-col space-y-6 relative z-20">
        {canManagePermissions && (
          <>
            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Permissions for {participant.name}
              </h3>
              
              {error && (
                <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs text-red-300">{error}</span>
                </div>
              )}

              <div className="space-y-3.5">
                {PERMISSION_TOGGLES.map(({ key, label, Icon }) => {
                  const currentValue = overrides[key];
                  const isEnabled = currentValue === true;
                  const isSaving = saving === key;

                  return (
                    <div key={key} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                        <p className="text-[13px] font-medium text-gray-300 group-hover:text-gray-100 transition-colors">{label}</p>
                      </div>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleToggle(key, currentValue)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
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
                            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                              isEnabled ? 'translate-x-4' : 'translate-x-1'
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-800/80" />
          </>
        )}

        {/* Moderation Actions */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Moderation
          </h3>
          <div className="space-y-1">
            <button 
              onClick={() => { onClose(); onReport(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Flag className="w-4 h-4 text-gray-500" />
              Report User
            </button>
            {canKick && (
              <button 
                onClick={() => { onClose(); onKick(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <UserMinus className="w-4 h-4 text-red-400/80" />
                Remove From Room
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default ParticipantManagementPopover;
