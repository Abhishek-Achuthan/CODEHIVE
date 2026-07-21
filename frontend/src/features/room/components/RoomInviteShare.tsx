import { useState } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { RoomService } from "../../../services/roomService";

interface RoomInviteShareProps {
  roomId: string;
}

export const RoomInviteShare = ({ roomId }: RoomInviteShareProps) => {
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLink = async (regenerate = false) => {
    setLoading(true);
    try {
      const data = regenerate
        ? await RoomService.regenerateRoomInvite(roomId)
        : await RoomService.createRoomInvite(roomId);
      setJoinUrl(data.joinUrl);
      return data.joinUrl;
    } catch {
      toast.error("Failed to get invite link");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const url = joinUrl ?? (await fetchLink(false));
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast.success("Invite link copied");
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 mr-2 bg-[#161b22] border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-gray-300 rounded-lg text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
        title="Copy invite link"
      >
        <Copy className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Copy Invite Link</span>
      </button>
    </div>
  );
};
