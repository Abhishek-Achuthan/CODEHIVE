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
          : 'hover:bg-gray-800/50 cursor-pointer hover:scale-[1.01]'
        }`}
    >
      <span className="text-sm text-gray-300 font-medium">{label}</span>
      <span className={`text-xs font-semibold ${done ? 'text-green-400' : 'text-gray-500'}`}>
        {done ? '✅ Complete' : '❌ Missing'}
      </span>
    </button>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="space-y-1.5">
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Profile Completion</span>
        <span className="text-xs font-semibold text-gray-300">{percentage}%</span>
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
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <svg className="w-4 h-4 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-yellow-400">Application Under Review</span>
        </div>
      );
    }

    if (status === MentorStatusValues.APPROVED) {
      return (
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <span className="text-lg">🎉</span>
          <span className="text-sm font-semibold text-green-400">You're a Mentor!</span>
        </div>
      );
    }

    if (status === MentorStatusValues.REJECTED) {
      return (
        <div className="space-y-2">
          {rejectionReason && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400">
                <span className="font-semibold">Rejection reason:</span> {rejectionReason}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onApply}
            disabled={!isProfileComplete || isApplying}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200
              ${isProfileComplete && !isApplying
                ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-[1.02]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
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
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200
          ${isProfileComplete && !isApplying
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-[1.02] shadow-lg shadow-purple-500/20'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
      >
        {isApplying ? 'Submitting...' : isProfileComplete ? 'Apply for Review' : 'Complete Profile to Apply'}
      </button>
    );
  };

  return (
    <SectionCard title="🎓 Become a Mentor">
      <div className="space-y-4">
        <p className="text-sm text-gray-400 leading-relaxed">
          Share your expertise and help others grow. Complete your profile to apply for mentor status.
        </p>

        <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3 space-y-1">
          <ChecklistRow
            label="About"
            done={checklist.aboutComplete}
            onClick={!checklist.aboutComplete ? () => onScrollToSection('about') : undefined}
          />
          <ChecklistRow
            label="Skills"
            done={checklist.skillsComplete}
            onClick={!checklist.skillsComplete ? () => onScrollToSection('skills') : undefined}
          />
          <ChecklistRow
            label="Experience"
            done={checklist.experienceComplete}
            onClick={!checklist.experienceComplete ? () => onScrollToSection('experience') : undefined}
          />
        </div>

        <ProgressBar percentage={completionPercentage} />

        {renderButton()}
      </div>
    </SectionCard>
  );
}
