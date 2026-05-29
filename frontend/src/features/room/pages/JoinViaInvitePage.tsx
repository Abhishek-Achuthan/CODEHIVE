import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import * as InviteAPI from "../../../api/endpoints/inviteAPI";
import type { InvitePreviewResponse } from "../../../shared/types/api/roomInvite";
import { formatRoomAccessError } from "../authorization/lifecycleMessages";

const JoinViaInvitePage = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<InvitePreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteCode) {
      setError("Invalid invite link");
      setLoading(false);
      return;
    }

    InviteAPI.previewInvite(inviteCode)
      .then((res) => {
        setPreview(res.data as InvitePreviewResponse);
        setError(null);
      })
      .catch(() => {
        setError("This invite link is invalid or has expired.");
      })
      .finally(() => setLoading(false));
  }, [inviteCode]);

  const handleJoin = async () => {
    if (!inviteCode || !preview?.canJoin) return;

    setJoining(true);
    try {
      const res = await InviteAPI.joinViaInvite(inviteCode);
      const data = res.data as { roomId: string };
      navigate(`/room/${data.roomId}`, { replace: true });
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      toast.error(
        typeof message === "string"
          ? formatRoomAccessError(message)
          : "Unable to join this room",
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010409] text-gray-300">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#010409] px-4 text-center text-gray-300">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="text-xl font-semibold text-white">Cannot join room</h1>
        <p className="mt-2 max-w-md text-gray-500">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/rooms")}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Back to rooms
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#010409] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-black p-8 text-center">
        <h1 className="text-2xl font-semibold text-white">{preview.title}</h1>
        <p className="mt-2 text-sm text-gray-400">Hosted by {preview.hostName}</p>

        {preview.isFull && (
          <p className="mt-4 text-sm text-amber-400">This room is full.</p>
        )}

        {!preview.canJoin && !preview.isFull && (
          <p className="mt-4 text-sm text-red-400">
            {preview.lifecycleStatus === 'ARCHIVED'
              ? 'This room has been archived and no longer accepts new participants.'
              : preview.lifecycleStatus === 'SCHEDULED'
                ? 'This room is not active yet. Try again when the session starts.'
                : 'You cannot join this room with this link.'}
          </p>
        )}

        <button
          type="button"
          disabled={!preview.canJoin || joining}
          onClick={handleJoin}
          className="mt-8 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {joining ? "Joining…" : "Join room"}
        </button>
      </div>
    </div>
  );
};

export default JoinViaInvitePage;
