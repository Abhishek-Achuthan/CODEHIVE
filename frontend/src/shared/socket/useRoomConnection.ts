import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../hooks/storeHooks";
import * as RoomAPI from "../../api/endpoints/roomAPI";
import { useSocket } from "./useSocket";
import { useRoomSocketEvent } from "./roomSocketEvents";
import { toErrorMessage } from "./roomErrors";
import type {
  RoomConnectionState,
  RoomSnapshot,
  RoomSocket,
  RoomSubscribedPayload,
} from "./roomTypes";

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

  useEffect(() => {
    setSnapshot(null);
    setError(null);
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
            }
          : current,
      );
      setError(null);
      setConnectionState("ready");
    },
    [roomId],
  );

  useRoomSocketEvent(roomSocket, "room:subscribed", handleSubscribed);

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
