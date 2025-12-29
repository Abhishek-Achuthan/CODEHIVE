import type { MentorChecklist } from "../types";
import SectionCard from "./SectionCard";

export interface MentorCardProps {
  disabled?: boolean;
  checked: boolean;
  checklist: MentorChecklist;
  onToggle: () => void;
}

function ChecklistRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-300">{label}</span>
      <span
        className={
          done
            ? "text-xs font-semibold text-green-400"
            : "text-xs font-semibold text-gray-500"
        }
      >
        {done ? "Done" : "Pending"}
      </span>
    </div>
  );
}

export default function MentorCard({
  disabled,
  checked,
  checklist,
  onToggle,
}: MentorCardProps) {
  return (
    <SectionCard title="Mentorship">
      <label className="flex items-center gap-3 text-sm text-gray-200">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
          className="h-4 w-4"
        />
        <span>I want to act as a mentor</span>
      </label>

      <div className="mt-4 grid gap-2 rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3">
        <ChecklistRow label="About" done={checklist.aboutComplete} />
        <ChecklistRow label="Skills" done={checklist.skillsComplete} />
        <ChecklistRow label="Experience" done={checklist.experienceComplete} />
      </div>

      {disabled ? (
        <div className="mt-3 text-xs text-gray-500">Checkbox disabled</div>
      ) : null}
    </SectionCard>
  );
}
