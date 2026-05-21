import { useState, useEffect, useCallback, useRef } from "react";
import type * as Y from "yjs";
import type { HocuspocusProvider } from "@hocuspocus/provider";
import { createPublicNoteProvider } from "../../collaboration/yjs/createPublicNoteProvider";
import { RoomService } from "../../../services/roomService";
import type { SaveStatus } from "./usePrivateNotes";

// Re-export SaveStatus so PublicNotes.tsx can import from one place.
export type { SaveStatus };

const DEBOUNCE_MS = 3000;

interface UsePublicNotesReturn {
  ydoc: Y.Doc | null;
  provider: HocuspocusProvider | null;
  persistedHTML: string;
  isLoading: boolean;
  loadError: string | null;
  collaborationError: string | null;
  saveStatus: SaveStatus;
  triggerSave: (html: string) => void;
}

export function usePublicNotes(
  roomId: string,
  enableCollaboration: boolean,
): UsePublicNotesReturn {
  const collabRef = useRef<ReturnType<typeof createPublicNoteProvider> | null>(
    null,
  );
  const [collaborationError, setCollaborationError] = useState<string | null>(
    null,
  );
  const ydoc = collabRef.current?.doc ?? null;
  const provider = collabRef.current?.provider ?? null;

  const [persistedHTML, setPersistedHTML] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (enableCollaboration && !collabRef.current) {
    collabRef.current = createPublicNoteProvider(roomId, {
      onAuthenticationFailed: (reason) => {
        setCollaborationError(
          reason || "You are not allowed to edit shared notes in this room.",
        );
      },
    });
  }

  useEffect(() => {
    setCollaborationError(null);

    if (!enableCollaboration) {
      collabRef.current?.provider.disconnect();
      collabRef.current?.doc.destroy();
      collabRef.current = null;
      return;
    }

    const instance = collabRef.current;
    if (!instance) return;

    return () => {
      instance.provider.disconnect();
      instance.doc.destroy();
      if (collabRef.current === instance) {
        collabRef.current = null;
      }
    };
  }, [enableCollaboration, roomId]);

  useEffect(() => {
    let cancelled = false;

    const fetchNote = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const note = await RoomService.getPublicNote(roomId);
        if (!cancelled) {
          setPersistedHTML(note?.content ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError("Failed to load room notes. Please try refreshing.");
          console.error("[usePublicNotes] fetch error:", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchNote();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const triggerSave = useCallback(
    (html: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setSaveStatus("saving");

      debounceTimer.current = setTimeout(async () => {
        if (!enableCollaboration) {
          setSaveStatus("idle");
          return;
        }
        try {
          await RoomService.savePublicNote(roomId, html);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err) {
          setSaveStatus("error");
          console.error("[usePublicNotes] save error:", err);
          setTimeout(() => setSaveStatus("idle"), 4000);
        }
      }, DEBOUNCE_MS);
    },
    [enableCollaboration, roomId],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    ydoc,
    provider,
    persistedHTML,
    isLoading,
    loadError,
    collaborationError,
    saveStatus,
    triggerSave,
  };
}
