import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import {
  Tldraw,
  Editor,
  react,
  computed,
  createPresenceStateDerivation,
  type TLRecord,
  type TLUser,
} from "tldraw";

import "tldraw/tldraw.css";

import { useWhiteboardContext } from "./WhiteboardProvider";
import { useYjsStore } from "../../hooks/useYjsStore";

interface TldrawEditorProps {
  roomId: string;
  user: {
    userId: string;
    userName: string;
  };
  canEdit: boolean;
}

const PRESENCE_COLORS = [
  "#f5222d",
  "#fa541c",
  "#fa8c16",
  "#faad14",
  "#fadb14",
  "#a0d911",
  "#52c41a",
  "#13c2c2",
  "#1890ff",
  "#2f54eb",
  "#722ed1",
  "#eb2f96",
] as const;

function colorIndexFromUserId(userId: string, palette: readonly string[]) {
  const hash = userId
    .split("")
    .reduce((acc, ch) => (acc << 5) - acc + ch.charCodeAt(0), 0);
  return Math.abs(hash) % palette.length;
}

const TldrawEditor: React.FC<TldrawEditorProps> = ({
  roomId,
  user,
  canEdit,
}) => {
  const { doc, provider, error: whiteboardError } = useWhiteboardContext();

  const editorRef = useRef<Editor | null>(null);

  const loadingState = useYjsStore({
    roomId,
    doc: doc ?? ({} as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    provider,
  });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateInstanceState({ isReadonly: !canEdit });
    }
  }, [canEdit]);


  if (whiteboardError) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d1117] text-red-400">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <AlertCircle className="w-8 h-8" />
          <div>
            <p className="text-sm font-semibold text-gray-100">Whiteboard access denied</p>
            <p className="text-xs text-gray-500 mt-1">{whiteboardError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingState.status === "loading") {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d1117] text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Initializing Board...</p>
        </div>
      </div>
    );
  }

  if (loadingState.status === "error") {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d1117] text-red-400">
        <p>Error loading whiteboard: {loadingState.error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full tldraw-wrapper">
      <Tldraw
        store={loadingState.store}
        autoFocus
        onMount={(editor: Editor) => {
          editorRef.current = editor;
          editor.updateInstanceState({ isReadonly: !canEdit });

          editor.user.updateUserPreferences({
            name: user.userName,
            color:
              PRESENCE_COLORS[
                colorIndexFromUserId(user.userId, PRESENCE_COLORS)
              ],
          });

          // ── Reactive signal for the current user
          const userSignal = computed<TLUser>("userSignal", () => {
            const prefs = editor.user.getUserPreferences();
            return {
              id: prefs.id as TLUser["id"],
              name: prefs.name ?? user.userName,
              color: prefs.color ?? PRESENCE_COLORS[0],
              meta: {},
              imageUrl: "",
              typeName: "user",
            };
          });

          // ── Local presence → Yjs awareness
          const presenceSignal = createPresenceStateDerivation(
            userSignal,
          )(editor.store);

          const disposePresence = react("sync presence to awareness", () => {
            const awareness = provider?.awareness;
            if (!awareness) return;

            const presence = presenceSignal.get();
            if (!presence) return;

            awareness.setLocalStateField("presence", presence);
          });

          // ── Remote awareness → tldraw store
          const handleAwarenessChange = () => {
            const awareness = provider?.awareness;
            if (!awareness) return;

            const states = awareness.getStates();

            editor.store.mergeRemoteChanges(() => {
              const activePresenceIds = new Set<string>();

              states.forEach((state, clientId) => {
                if (clientId === awareness.clientID) return; // skip self

                const presence = state.presence as TLRecord | undefined;
                if (!presence) return;

                activePresenceIds.add(presence.id);
                editor.store.put([presence]);
              });

              const ownPresenceId = presenceSignal.get()?.id ?? null;

              const records = editor.store.query
                .records("instance_presence")
                .get();

              for (const record of records) {
                if (
                  record.id !== ownPresenceId &&
                  !activePresenceIds.has(record.id)
                ) {
                  editor.store.remove([record.id]);
                }
              }
            });
          };

          const awareness = provider?.awareness;
          if (awareness) {
            awareness.on("change", handleAwarenessChange);
            handleAwarenessChange();
          }

          return () => {
            disposePresence();
            awareness?.off("change", handleAwarenessChange);
            editorRef.current = null;
          };
        }}
      />

      <style>{`
        .tldraw-wrapper .tl-container {
          background-color: #0d1117 !important;
        }
        .tl-toolbar {
          background-color: #161b22 !important;
          border: 1px solid #30363d !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default TldrawEditor;
