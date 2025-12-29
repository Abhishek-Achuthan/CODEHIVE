import SectionCard from "./SectionCard";

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
    <SectionCard title="Activity">
      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total sessions taken</span>
          <span className="text-white font-semibold">{totalSessionsLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Joined rooms</span>
          <span className="text-white font-semibold">{joinedRoomsLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Q&amp;A contributions</span>
          <span className="text-white font-semibold">{qnaContributionsLabel}</span>
        </div>
      </div>
    </SectionCard>
  );
}
