import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { store } from '../../../store';

export const createCollabProvider = (roomId: string) => {
  const doc = new Y.Doc();

  const url = import.meta.env.VITE_HOCUSPOCUS_URL || 'ws://localhost:1234';
  const normalizedRoomId = roomId.trim();
  const documentName = `room:${normalizedRoomId}`;

  const provider = new HocuspocusProvider({
    url,
    name: documentName,
    document: doc,
    token: () => store.getState().auth.accessToken || '',
    onAuthenticationFailed: ({ reason }) => {
      console.error('[Hocuspocus] authentication failed', { documentName, reason });
    },
  });

  return { doc, provider, documentName, roomId: normalizedRoomId };
};
