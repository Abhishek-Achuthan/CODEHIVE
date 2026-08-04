import { useNavigate } from "react-router-dom";
import SectionCard from "../../profile/components/SectionCard";

interface BookSessionCardProps {
  mentorId: string;
}

export default function BookSessionCard({ mentorId }: BookSessionCardProps) {
  const navigate = useNavigate();

  return (
    <SectionCard title="📅 Book a Session">
      <div className="space-y-3">
        <p className="text-sm text-gray-400 leading-relaxed">
          Ready to level up? Book a 1-on-1 mentorship session with this mentor.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/mentors/${mentorId}/book`)}
          className="w-full rounded-lg border border-white/10 bg-white py-2.5 px-4 text-sm font-semibold text-black transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.01] shadow-lg shadow-black/30"
        >
          Book Session
        </button>
      </div>
    </SectionCard>
  );
}
