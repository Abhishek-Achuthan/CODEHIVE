import { useMemo } from "react";
import type { MentorChecklist, MentorStatus } from "../types";
import { MentorStatus as MentorStatusValues } from "../types";
import SectionCard from "./SectionCard";

export interface MentorCardProps {
  checklist: MentorChecklist;
  status: MentorStatus;
  rejectionReason?: string;
  onApply: () => void;
  onScrollToSection: (section: 'about' | 'skills' | 'experience') => void;
  isApplying?: boolean;
}

interface ChecklistRowProps {
  label: string;
  done: boolean;
  onClick?: () => void;
}

function ChecklistRow({ label, done, onClick }: ChecklistRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={done}
      className={`flex w-full items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200
        ${done
          ? 'cursor-default'
          : 'hover:bg-zinc-800/50 cursor-pointer hover:scale-[1.01]'
        }`}
    >
      <span className="text-[13px] text-zinc-300 font-medium">{label}</span>
      <span className={`text-[11px] font-semibold tracking-wide uppercase ${done ? 'text-emerald-500' : 'text-zinc-500'}`}>
        {done ? 'Complete' : 'Missing'}
      </span>
    </button>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-zinc-400">Profile Completion</span>
        <span className="text-xs font-bold text-zinc-200">{percentage}%</span>
      </div>
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function MentorCard({
  checklist,
  status,
  rejectionReason,
  onApply,
  onScrollToSection,
  isApplying = false,
}: MentorCardProps) {
  const completionPercentage = useMemo(() => {
    const total = 3;
    const completed = [
      checklist.aboutComplete,
      checklist.skillsComplete,
      checklist.experienceComplete,
    ].filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [checklist]);

  const isProfileComplete = completionPercentage === 100;

  const renderButton = () => {
    if (status === MentorStatusValues.PENDING) {
      return (
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[13px] font-semibold text-amber-500">Application Under Review</span>
        </div>
      );
    }

    if (status === MentorStatusValues.APPROVED) {
      return (
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="text-lg">🎉</span>
          <span className="text-[13px] font-semibold text-emerald-500">You're a Mentor!</span>
        </div>
      );
    }

    if (status === MentorStatusValues.REJECTED) {
      return (
        <div className="space-y-3">
          {rejectionReason && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <p className="text-[13px] text-rose-400 leading-relaxed">
                <span className="font-semibold block mb-1">Rejection reason:</span> {rejectionReason}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onApply}
            disabled={!isProfileComplete || isApplying}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm
              ${isProfileComplete && !isApplying
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.01]'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
          >
            {isApplying ? 'Submitting...' : 'Reapply for Mentor Role'}
          </button>
        </div>
      );
    }

    // Default state (NONE)
    return (
      <button
        type="button"
        onClick={onApply}
        disabled={!isProfileComplete || isApplying}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm
          ${isProfileComplete && !isApplying
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.01]'
            : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
      >
        {isApplying ? 'Submitting...' : isProfileComplete ? 'Apply for Review' : 'Complete Profile to Apply'}
      </button>
    );
  };

  return (
    <SectionCard title="🎓 Become a Mentor">
      <div className="space-y-6">
        <p className="text-[13px] text-zinc-400 leading-relaxed">
          Share your expertise and help others grow. Complete your profile to apply for mentor status.
        </p>

        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-2 space-y-0.5">
          <ChecklistRow
            label="About Section"
            done={checklist.aboutComplete}
            onClick={!checklist.aboutComplete ? () => onScrollToSection('about') : undefined}
          />
          <ChecklistRow
            label="Skills Added"
            done={checklist.skillsComplete}
            onClick={!checklist.skillsComplete ? () => onScrollToSection('skills') : undefined}
          />
          <ChecklistRow
            label="Experience Details"
            done={checklist.experienceComplete}
            onClick={!checklist.experienceComplete ? () => onScrollToSection('experience') : undefined}
          />
        </div>

        <ProgressBar percentage={completionPercentage} />

        <div className="pt-2">
          {renderButton()}
        </div>
      </div>
    </SectionCard>
  );
}
