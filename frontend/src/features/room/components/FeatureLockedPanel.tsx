import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Lock, Sparkles } from 'lucide-react';
import type { FeatureKey } from '../../../shared/types/api/room';

export type FeatureLockReason = 'upgrade' | 'readonly' | 'permission';

const FEATURE_LABELS: Record<FeatureKey, string> = {
  chat: 'Chat',
  notes: 'Notes',
  polls: 'Polls',
  whiteboard: 'Whiteboard',
  screen_share: 'Screen share',
  code_editor: 'Code editor',
  video_audio: 'Video & audio',
  private_rooms: 'Private rooms',
  session_booking: 'Session booking',
};

interface FeatureLockedPanelProps {
  feature: FeatureKey;
  reason: FeatureLockReason;
  planName?: string;
}

export const FeatureLockedPanel: React.FC<FeatureLockedPanelProps> = ({
  feature,
  reason,
  planName,
}) => {
  const label = FEATURE_LABELS[feature];

  const title =
    reason === 'upgrade'
      ? `Unlock ${label}`
      : reason === 'readonly'
        ? `${label} is read-only`
        : `${label} unavailable`;

  const description =
    reason === 'upgrade'
      ? `Your current plan${planName ? ` (${planName})` : ''} does not include ${label.toLowerCase()} in collaboration rooms. Upgrade to use it with your team.`
      : reason === 'readonly'
        ? 'This room is in read-only mode. You can browse but not edit or create content.'
        : `You do not have permission to use ${label.toLowerCase()} in this room.`;

  return (
    <div className="flex h-full items-center justify-center bg-[#0d1117] p-6">
      <div className="relative max-w-sm w-full overflow-hidden rounded-2xl border border-gray-800 bg-linear-to-b from-[#161b22] to-[#0d1117] p-6 text-center shadow-xl">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl" />

        <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-700/80 bg-[#010409]">
          {reason === 'upgrade' ? (
            <Crown className="h-7 w-7 text-amber-400" />
          ) : (
            <Lock className="h-7 w-7 text-gray-500" />
          )}
        </div>

        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="h-3 w-3" />
            {reason === 'upgrade' ? 'Plan feature' : 'Restricted'}
          </div>

          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>

          {reason === 'upgrade' && (
            <Link
              to="/pricing"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <Crown className="h-4 w-4" />
              View plans & upgrade
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
