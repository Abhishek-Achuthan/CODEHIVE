import { useEffect } from 'react';
import type {
  RoomSocket,
  ServerToClientRoomEvents,
} from './roomTypes';

type RoomSocketEventTarget = {
  on: <EventName extends keyof ServerToClientRoomEvents>(
    eventName: EventName,
    handler: ServerToClientRoomEvents[EventName]
  ) => void;
  off: <EventName extends keyof ServerToClientRoomEvents>(
    eventName: EventName,
    handler: ServerToClientRoomEvents[EventName]
  ) => void;
};

export const useRoomSocketEvent = <EventName extends keyof ServerToClientRoomEvents>(
  socket: RoomSocket | null,
  eventName: EventName,
  handler: ServerToClientRoomEvents[EventName],
  enabled = true
) => {
  useEffect(() => {
    if (!socket || !enabled) return;

    const wrappedHandler = (...args: unknown[]) => {
      (handler as (...args: unknown[]) => void)(...args);
    };

    const eventSocket = socket as unknown as RoomSocketEventTarget;

    eventSocket.on(
      eventName,
      wrappedHandler as ServerToClientRoomEvents[EventName]
    );

    return () => {
      eventSocket.off(
        eventName,
        wrappedHandler as ServerToClientRoomEvents[EventName]
      );
    };
  }, [socket, eventName, handler, enabled]);
};
