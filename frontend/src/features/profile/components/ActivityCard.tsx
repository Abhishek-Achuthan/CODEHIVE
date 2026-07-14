import SectionCard from "./SectionCard";
import { Users, LayoutDashboard, MessageSquare } from "lucide-react";

export interface ActivityCardProps {
  totalSessionsLabel: string;
  joinedRoomsLabel: string;
  qnaContributionsLabel: string;
}

export default function ActivityCard({
  totalSessionsLabel,
  joinedRoomsLabel,
  qnaContributionsLabel,
}: ActivityCardProps) {
  return (
    <SectionCard title="Activity Summary">
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
          <div className="flex items-center gap-3 text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Total Sessions Taken</span>
          </div>
          <span className="text-zinc-100 font-semibold">{totalSessionsLabel}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
          <div className="flex items-center gap-3 text-zinc-400">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Joined Rooms</span>
          </div>
          <span className="text-zinc-100 font-semibold">{joinedRoomsLabel}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
          <div className="flex items-center gap-3 text-zinc-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Q&A Contributions</span>
          </div>
          <span className="text-zinc-100 font-semibold">{qnaContributionsLabel}</span>
        </div>
      </div>
    </SectionCard>
  );
}
