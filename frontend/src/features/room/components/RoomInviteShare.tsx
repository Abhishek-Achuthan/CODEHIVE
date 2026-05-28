import { useState } from "react";
import { Copy, Link2, RefreshCw } from "lucide-react";
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

  const handleRegenerate = async () => {
    const url = await fetchLink(true);
    if (url) {
      toast.success("New invite link generated");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleCopy}
        disabled={loading}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
        title="Copy invite link"
      >
        <Copy className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Copy link</span>
      </button>
      <button
        type="button"
        onClick={handleRegenerate}
        disabled={loading}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
        title="Reset invite link"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      </button>
      <Link2 className="h-4 w-4 text-gray-600" aria-hidden />
    </div>
  );
};
