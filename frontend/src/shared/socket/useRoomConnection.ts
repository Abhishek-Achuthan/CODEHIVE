import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getLifecycleTransitionToast } from "../../features/room/authorization/lifecycleMessages";
import { useAppSelector } from "../hooks/storeHooks";
import * as RoomAPI from "../../api/endpoints/roomAPI";
import { useSocket } from "./useSocket";
import { useRoomSocketEvent } from "./roomSocketEvents";
import { toErrorMessage } from "./roomErrors";
import type {
  ParticipantPermissionsUpdatedPayload,
  RoomConnectionState,
  RoomLifecycleChangedPayload,
  RoomSnapshot,
  RoomSocket,
  RoomSubscribedPayload,
} from "./roomTypes";
import type { CapabilityKey } from "../types/api/room";

interface RoomConnectionResult {
  connectionState: RoomConnectionState;
  snapshot: RoomSnapshot | null;
  error: string | null;
  leaveRoom: () => void;
}

export const useRoomConnection = (
  roomId: string | null,
): RoomConnectionResult => {
  const { socket, isConnected } = useSocket();
  const roomSocket = socket as RoomSocket | null;
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id ?? null;
  const currentUserName = useMemo(() => {
    if (!currentUser) return null;
    return `${currentUser.firstName} ${currentUser.lastName}`;
  }, [currentUser]);
  const currentUserAvatarUrl = currentUser?.avatarUrl;

  const [connectionState, setConnectionState] =
    useState<RoomConnectionState>("idle");
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previousLifecycleRef = useRef<string | null>(null);

  useEffect(() => {
    setSnapshot(null);
    setError(null);
    previousLifecycleRef.current = null;
    setConnectionState(roomId && currentUserId ? "joining" : "idle");
  }, [roomId, currentUserId]);

  useEffect(() => {
    if (connectionState !== "joining" || !roomId || !currentUserId) return;

    let isActive = true;

    RoomAPI.joinRoom(roomId)
      .then((response) => {
        if (!isActive) return;
        const nextSnapshot = response.data as RoomSnapshot;
        if (nextSnapshot.roomId !== roomId) return;

        setSnapshot(nextSnapshot);
        setError(null);
        setConnectionState("snapshot-ready");
      })
      .catch((joinError: unknown) => {
        if (!isActive) return;
        setError(toErrorMessage(joinError));
        setConnectionState("error");
      });


    return () => {
      isActive = false;
    };
  }, [connectionState, roomId, currentUserId]);

  useEffect(() => {
    if (!roomId || !snapshot) return;
    if (connectionState !== "ready" && connectionState !== "subscribing")
      return;
    if (isConnected) return;

    setConnectionState("snapshot-ready");
  }, [connectionState, isConnected, roomId, snapshot]);

  useEffect(() => {
    if (
      connectionState !== "snapshot-ready" ||
      !roomSocket ||
      !isConnected ||
      !roomId ||
      !currentUserName
    ) {
      return;
    }

    setConnectionState("subscribing");
    roomSocket.emit("room:subscribe", {
      roomId,
      user: {
        name: currentUserName,
        ...(currentUserAvatarUrl ? { avatarUrl: currentUserAvatarUrl } : {}),
      },
    });
  }, [
    connectionState,
    currentUserAvatarUrl,
    currentUserName,
    isConnected,
    roomId,
    roomSocket,
  ]);

  const handleSubscribed = useCallback(
    (payload: RoomSubscribedPayload) => {
      if (!roomId || payload.roomId !== roomId) return;

      setSnapshot((current) =>
        current
          ? {
              ...current,
              onlineUserIds: payload.onlineUserIds ?? current.onlineUserIds,
              capabilities: payload.capabilities ?? current.capabilities,
              lifecycleStatus: payload.lifecycleStatus ?? current.lifecycleStatus,
              featureSnapshot: payload.featureSnapshot ?? current.featureSnapshot,
            }
          : current,
      );
      setError(null);
      setConnectionState("ready");
    },
    [roomId],
  );

  useRoomSocketEvent(roomSocket, "room:subscribed", handleSubscribed);

  const handleLifecycleChanged = useCallback(
    (payload: RoomLifecycleChangedPayload) => {
      if (!roomId || payload.roomId !== roomId) return;

      setSnapshot((current) =>
        current
          ? {
              ...current,
              lifecycleStatus: payload.lifecycleStatus,
            }
          : current,
      );

      if (previousLifecycleRef.current !== payload.lifecycleStatus) {
        const message = getLifecycleTransitionToast(payload.lifecycleStatus);
        if (message) {
          toast(message, { icon: "ℹ️" });
        }
        previousLifecycleRef.current = payload.lifecycleStatus;
      }
    },
    [roomId],
  );

  useRoomSocketEvent(roomSocket, "room:lifecycle-changed", handleLifecycleChanged);

  const handlePermissionsUpdated = useCallback(
    (payload: ParticipantPermissionsUpdatedPayload) => {
      if (!roomId || payload.roomId !== roomId) return;
      // Only patch capabilities when the event targets the current user.
      // Other participants' overrides don't affect this client's capability state.
      if (payload.userId !== currentUserId) return;

      setSnapshot((current) => {
        if (!current) return current;
        // Merge the incoming overrides into the existing capabilities map.
        // The server sends the full merged override map, so we apply each
        // key directly — true/false overrides replace the role-default value.
        const updatedCapabilities: Partial<Record<CapabilityKey, boolean>> = {
          ...current.capabilities,
          ...(payload.overrides as Partial<Record<CapabilityKey, boolean>>),
        };
        return { ...current, capabilities: updatedCapabilities };
      });
    },
    [roomId, currentUserId],
  );

  useRoomSocketEvent(
    roomSocket,
    "participant:permissions-updated",
    handlePermissionsUpdated,
  );

  const handleSocketError = useCallback((payload: { message: string }) => {
    setError(payload.message);
    setConnectionState("error");
  }, []);

  useRoomSocketEvent(roomSocket, "error", handleSocketError);

  const leaveRoom = useCallback(() => {
    if (!roomId) return;

    if (roomSocket && isConnected && connectionState === "ready") {
      roomSocket.emit("room:leave", { roomId });
    }

    RoomAPI.leaveRoom(roomId).catch(() => undefined);
    setSnapshot(null);
    setError(null);
    setConnectionState("idle");
  }, [connectionState, isConnected, roomId, roomSocket]);

  return {
    connectionState,
    snapshot,
    error,
    leaveRoom,
  };
};

export default useRoomConnection;
