import React, { createContext, useContext, useMemo } from "react";

import type { JoinRoomSnapshotResponse } from "../../../shared/types/api/room";
import {
  buildRoomAuthorization,
  type RoomAuthorizationState,
} from "./roomAuthorization";

const RoomAuthorizationContext = createContext<RoomAuthorizationState | null>(null);

interface RoomAuthorizationProviderProps {
  snapshot: JoinRoomSnapshotResponse | null;
  children: React.ReactNode;
}

export const RoomAuthorizationProvider: React.FC<RoomAuthorizationProviderProps> = ({
  snapshot,
  children,
}) => {
  const value = useMemo(() => buildRoomAuthorization(snapshot), [snapshot]);

  return (
    <RoomAuthorizationContext.Provider value={value}>
      {children}
    </RoomAuthorizationContext.Provider>
  );
};

export const useRoomAuthorization = (): RoomAuthorizationState => {
  const context = useContext(RoomAuthorizationContext);
  if (!context) {
    throw new Error("useRoomAuthorization must be used within RoomAuthorizationProvider");
  }

  return context;
};
