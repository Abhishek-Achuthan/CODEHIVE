import type { Socket } from 'socket.io';

import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

export function getUserId(socket: Socket, quiet = false): string | null {
  const userId = socket.data.userId;

  if (!userId || typeof userId !== 'string') {
    if (quiet) return null;
    throw new Error(ERROR_MESSAGES.ROOM.UNAUTHORIZED);
  }

  return userId;
}

export function getJoinedRoomIds(socket: Socket): Set<string> {
  const existing = socket.data.joinedRoomIds;
  if (existing instanceof Set) {
    return existing as Set<string>;
  }

  const joinedRoomIds = new Set<string>();
  socket.data.joinedRoomIds = joinedRoomIds;
  return joinedRoomIds;
}

export function emitSocketError(socket: Socket, error: unknown): void {
  const message =
    error instanceof Error ? error.message : ERROR_MESSAGES.SERVER.UNEXPECTED_ERROR;
  socket.emit('error', { message });
}
