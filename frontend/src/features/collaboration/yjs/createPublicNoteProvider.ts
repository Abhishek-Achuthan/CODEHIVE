import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { store } from '../../../store';

/**
 * Creates a Yjs document + Hocuspocus provider specifically for the
 * room-level shared public note.
 *
 * Document naming convention: `room-{roomId}-public-note`
 * This is intentionally separate from the Monaco code-editor provider
 * (which uses `room:{roomId}`) to avoid document-name collisions.
 */
export const createPublicNoteProvider = (roomId: string) => {
  const doc = new Y.Doc();

  const url = import.meta.env.VITE_HOCUSPOCUS_URL || 'ws://localhost:1234';
  const normalizedRoomId = roomId.trim();
  const documentName = `room-${normalizedRoomId}-public-note`;

  const provider = new HocuspocusProvider({
    url,
    name: documentName,
    document: doc,
    token: () => store.getState().auth.accessToken || '',
    onAuthenticationFailed: ({ reason }) => {
      console.error('[Hocuspocus:PublicNote] authentication failed', {
        documentName,
        reason,
      });
    },
  });

  return { doc, provider, documentName };
};
