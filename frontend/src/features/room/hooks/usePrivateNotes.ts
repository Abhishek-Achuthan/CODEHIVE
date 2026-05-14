import { useState, useEffect, useCallback, useRef } from 'react';
import { RoomService } from '../../../services/roomService';
import type { PrivateNoteResponse } from '../../../shared/types/api/room';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UsePrivateNotesReturn {
  content: Record<string, unknown>;
  isLoading: boolean;
  loadError: string | null;
  saveStatus: SaveStatus;
  updateContent: (newContent: Record<string, unknown>) => void;
}

const DEBOUNCE_MS = 2500;

export function usePrivateNotes(roomId: string): UsePrivateNotesReturn {
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContent = useRef<Record<string, unknown>>({});

  // Fetch note on mount
  useEffect(() => {
    let cancelled = false;

    const fetchNote = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const note: PrivateNoteResponse | null = await RoomService.getPrivateNote(roomId);
        if (!cancelled) {
          const loaded = note?.content ?? {};
          setContent(loaded);
          latestContent.current = loaded;
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError('Failed to load your notes. Please try refreshing.');
          console.error('[usePrivateNotes] fetch error:', err);
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

  // Debounced save
  const triggerSave = useCallback(
    (contentToSave: Record<string, unknown>) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setSaveStatus('saving');

      debounceTimer.current = setTimeout(async () => {
        try {
          await RoomService.savePrivateNote(roomId, contentToSave);
          setSaveStatus('saved');
          // Reset to idle after a few seconds
          setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
          setSaveStatus('error');
          console.error('[usePrivateNotes] save error:', err);
          setTimeout(() => setSaveStatus('idle'), 4000);
        }
      }, DEBOUNCE_MS);
    },
    [roomId]
  );

  const updateContent = useCallback(
    (newContent: Record<string, unknown>) => {
      setContent(newContent);
      latestContent.current = newContent;
      triggerSave(newContent);
    },
    [triggerSave]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    content,
    isLoading,
    loadError,
    saveStatus,
    updateContent,
  };
}
