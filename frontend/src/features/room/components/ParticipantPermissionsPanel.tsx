import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { RoomService } from '../../../services/roomService';

const PERMISSION_TOGGLES: {
  key: string;
  label: string;
  description: string;
}[] = [
  {
    key: 'room.whiteboard.draw',
    label: 'Draw on Whiteboard',
    description: 'Can draw and edit the shared whiteboard',
  },
  {
    key: 'room.public_notes.edit',
    label: 'Edit Public Notes',
    description: 'Can write and modify shared room notes',
  },
  {
    key: 'room.polls.create',
    label: 'Create & Manage Polls',
    description: 'Can create and close polls',
  },
  {
    key: 'room.screenshare.start',
    label: 'Share Screen',
    description: 'Can start a screen share session',
  },
];

interface ParticipantPermissionsPanelProps {
  roomId: string;
  participantId: string;
  participantName: string;
  initialOverrides: Record<string, boolean>;
  onOverridesUpdated: (overrides: Record<string, boolean>) => void;
}

const ParticipantPermissionsPanel: React.FC<ParticipantPermissionsPanelProps> = ({
  roomId,
  participantId,
  participantName,
  initialOverrides,
  onOverridesUpdated,
}) => {
  const [overrides, setOverrides] = useState<Record<string, boolean>>(initialOverrides);
  const [saving, setSaving] = useState<string | null>(null); // key of the toggle being saved
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (key: string, currentValue: boolean | undefined) => {
    const newValue = !(currentValue ?? false);
    setSaving(key);
    setError(null);

    try {
      const result = await RoomService.updateParticipantOverrides(
        roomId,
        participantId,
        { [key]: newValue },
      );
      setOverrides(result.overrides);
      onOverridesUpdated(result.overrides);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update permission';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-lg mx-2 mb-2 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Permissions — {participantName}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border-b border-red-500/20">
          <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
          <span className="text-[10px] text-red-300">{error}</span>
        </div>
      )}

      {/* Toggle list */}
      <div className="divide-y divide-gray-800/60">
        {PERMISSION_TOGGLES.map(({ key, label, description }) => {
          const currentValue = overrides[key];
          const isEnabled = currentValue === true;
          const isSaving = saving === key;

          return (
            <div
              key={key}
              className="flex items-center justify-between px-3 py-2.5 gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-300 truncate">{label}</p>
                <p className="text-[10px] text-gray-600 truncate">{description}</p>
              </div>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleToggle(key, currentValue)}
                aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${label}`}
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
  );
};

export default ParticipantPermissionsPanel;
