import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Calendar,
  Copy,
  Globe,
  Lock,
  Loader2,
  RefreshCw,
  User,
  Share2,
  Link2Off,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";
import { RoomService } from "../../../services/roomService";
import type { RoomSettingsResponse } from "../../../shared/types/api/roomSettings";
import { UserRole } from "../../../shared/constants/auth";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import type { RoomVisibility } from "../../../shared/types/api/room";

interface RoomDetailsModalProps {
  roomId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetailsUpdated?: () => void;
  readOnly?: boolean;
}

function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function visibilityLabel(visibility: RoomSettingsResponse["visibility"]): string {
  return visibility === "PRIVATE" ? "Private" : "Public";
}

function getHostName(host?: RoomSettingsResponse["host"] | null): string {
  if (!host) {
    return "Unknown user";
  }

  const fullName = [host.firstName, host.lastName].filter(Boolean).join(" ").trim();
  return fullName || "Unknown user";
}

function getHostAvatar(host?: RoomSettingsResponse["host"] | null): string {
  if (host?.avatarUrl) {
    return host.avatarUrl;
  }

  if (host?.id) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${host.id}`;
  }

  return "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown-user";
}

function getHostProfilePath(
  host: RoomSettingsResponse["host"],
  currentUserId: string | undefined,
): string | null {
  if (host.id === currentUserId) {
    return "/profile";
  }
  if (host.role === UserRole.MENTOR) {
    return `/mentors/${host.id}`;
  }
  return null;
}

export const RoomDetailsModal = ({
  roomId,
  open,
  onOpenChange,
  onDetailsUpdated,
  readOnly,
}: RoomDetailsModalProps) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [settings, setSettings] = useState<RoomSettingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [cachedJoinUrl, setCachedJoinUrl] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState<RoomVisibility>("PRIVATE");
  const [savingDetails, setSavingDetails] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RoomService.getRoomSettings(roomId);
      setSettings(data);
      setCachedJoinUrl(data.joinUrl ?? null);
      setEditTitle(data.title);
      setEditDescription(data.description || "");
      setEditVisibility(data.visibility);
    } catch {
      toast.error("Failed to load room settings");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }, [roomId, onOpenChange]);

  useEffect(() => {
    if (open) {
      void loadSettings();
      setIsEditing(false);
    } else {
      setSettings(null);
      setCachedJoinUrl(null);
      setIsEditing(false);
    }
  }, [open, loadSettings]);

  const resolveJoinUrl = async (regenerate: boolean): Promise<string | null> => {
    if (!regenerate && cachedJoinUrl) {
      return cachedJoinUrl;
    }

    setLinkLoading(true);
    try {
      const data = regenerate
        ? await RoomService.regenerateRoomInvite(roomId)
        : await RoomService.createRoomInvite(roomId);
      setCachedJoinUrl(data.joinUrl);
      return data.joinUrl;
    } catch {
      toast.error(regenerate ? "Failed to regenerate link" : "Failed to get invite link");
      return null;
    } finally {
      setLinkLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const url = await resolveJoinUrl(false);
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast.success("Invite link copied");
  };

  const handleRegenerateLink = async () => {
    const url = await resolveJoinUrl(true);
    if (url) {
      toast.success("New invite link generated");
    }
  };

  const handleRevokeLink = async () => {
    setLinkLoading(true);
    try {
      await RoomService.revokeRoomInvite(roomId, "active");
      setCachedJoinUrl(null);
      setSettings((prev) => (prev ? { ...prev, hasActiveInvite: false, joinUrl: undefined } : null));
      toast.success("Invite link revoked. Old link is now invalid.");
    } catch {
      toast.error("Failed to revoke invite link");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleShareLink = async () => {
    const url = await resolveJoinUrl(false);
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: settings?.title || "CodeHive Room",
          text: `Join collaboration room "${settings?.title}" on CodeHive`,
          url: url,
        });
        toast.success("Share dialog opened");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    await navigator.clipboard.writeText(url);
    toast.success("Invite link copied for sharing!");
  };

  const handleHostClick = () => {
    if (!settings?.host) return;
    const path = getHostProfilePath(settings.host, currentUser?.id);
    if (!path) {
      toast.error("Public profile is not available for this user");
      return;
    }
    onOpenChange(false);
    navigate(path);
  };

  const handleSaveDetails = async () => {
    if (!editTitle.trim()) {
      toast.error("Room name cannot be empty");
      return;
    }
    if (editTitle.trim().length > 40) {
      toast.error("Room title cannot exceed 40 characters");
      return;
    }
    setSavingDetails(true);
    try {
      const data = await RoomService.updateRoomDetails(roomId, {
        title: editTitle.trim(),
        description: editDescription,
        visibility: editVisibility,
      });
      setSettings((prev) => {
        if (!prev) {
          return data;
        }

        return {
          ...prev,
          ...data,
          host: data.host ?? prev.host,
          createdAt: data.createdAt ?? prev.createdAt,
          canManageInviteLink: data.canManageInviteLink ?? prev.canManageInviteLink,
          joinUrl: data.joinUrl ?? prev.joinUrl,
          hasActiveInvite: data.hasActiveInvite ?? prev.hasActiveInvite,
        };
      });
      setIsEditing(false);
      onDetailsUpdated?.();
      toast.success("Room details updated");
    } catch (error) {
      toast.error(error instanceof AxiosError
        ? (error.response?.data?.message ?? "Failed to update room details")
        : error instanceof Error
          ? (error.message || "Failed to update room details")
          : "Failed to update room details");
    } finally {
      setSavingDetails(false);
    }
  };

  const hostName = getHostName(settings?.host);
  const hostAvatar = getHostAvatar(settings?.host);

  const canEdit = settings?.host?.id === currentUser?.id || settings?.canManageInviteLink;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-800 bg-[#0d1117] text-gray-100 sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <div>
              <DialogTitle className="text-gray-100">Room Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                {isEditing ? "Update your collaboration room details." : "Details about this collaboration room."}
              </DialogDescription>
            </div>
            {!loading && settings && canEdit && !isEditing && !readOnly && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-medium bg-[#161b22] text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800 rounded-md transition-colors mr-6"
              >
                Edit Room
              </button>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : settings ? (
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4 border border-gray-800 rounded-lg p-4 bg-[#161b22]">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Room Name</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={40}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-gray-500 text-xs text-right mt-1">
                    {editTitle.length}/40
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">Visibility</label>
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value as RoomVisibility)}
                    className="w-full bg-[#0d1117] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="PRIVATE">Private</option>
                    <option value="PUBLIC_REQUEST">Public</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(settings.title);
                      setEditDescription(settings.description || "");
                      setEditVisibility(settings.visibility);
                    }}
                    disabled={savingDetails}
                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={savingDetails}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {savingDetails && <Loader2 className="w-3 h-3 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-100">{settings.title}</h3>
                {settings.description ? (
                  <p className="text-sm leading-relaxed text-gray-400">{settings.description}</p>
                ) : (
                  <p className="text-sm italic text-gray-600">No description</p>
                )}
              </section>
            )}

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#161b22] px-3 py-2.5">
                {settings.visibility === "PRIVATE" ? (
                  <Lock className="h-4 w-4 shrink-0 text-amber-400" />
                ) : (
                  <Globe className="h-4 w-4 shrink-0 text-emerald-400" />
                )}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Visibility
                  </p>
                  <p className="text-sm font-medium text-gray-200">
                    {visibilityLabel(settings.visibility)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#161b22] px-3 py-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-blue-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Created
                  </p>
                  <p className="text-sm font-medium text-gray-200">
                    {formatCreatedAt(settings.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Host
              </p>
              <button
                type="button"
                onClick={handleHostClick}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-800 bg-[#161b22] p-3 text-left transition-colors hover:border-gray-700 hover:bg-gray-800/60"
              >
                <img
                  src={hostAvatar}
                  alt={hostName}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown-user";
                  }}
                  className="h-11 w-11 rounded-full border border-gray-700 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-100">{hostName}</p>
                  <p className="text-xs capitalize text-gray-500">
                    {settings.host?.role ?? "user"}
                  </p>
                </div>
                <User className="h-4 w-4 shrink-0 text-gray-500" />
              </button>
            </section>

            {settings.canManageInviteLink && (
              <section className="space-y-3 border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Invite Link & Access Controls
                  </p>
                  {cachedJoinUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Link
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  As host, you can copy, share, regenerate, or revoke access to this room. Revoking will immediately invalidate any previous link.
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => void handleCopyLink()}
                    disabled={linkLoading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-[#161b22] px-3 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
                  >
                    <Copy className="h-3.5 w-3.5 text-blue-400" />
                    Copy Link
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleShareLink()}
                    disabled={linkLoading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-[#161b22] px-3 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
                  >
                    <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                    Share
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleRegenerateLink()}
                    disabled={linkLoading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-[#161b22] px-3 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 text-purple-400 ${linkLoading ? "animate-spin" : ""}`}
                    />
                    Regenerate
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleRevokeLink()}
                    disabled={linkLoading || (!cachedJoinUrl && !settings.hasActiveInvite)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Link2Off className="h-3.5 w-3.5 text-red-400" />
                    Revoke
                  </button>
                </div>

                {cachedJoinUrl ? (
                  <div className="rounded-md border border-gray-800 bg-[#0d1117] p-2.5">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Active Invite URL:</p>
                    <p className="truncate text-xs font-mono text-blue-400" title={cachedJoinUrl}>
                      {cachedJoinUrl}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-500/90 italic bg-amber-500/5 border border-amber-500/10 rounded-md p-2">
                    No active invite link. Click "Copy Link" or "Regenerate" to create a new shareable URL.
                  </p>
                )}
              </section>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
