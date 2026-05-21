import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { store } from '../../../store';

interface CollabProviderOptions {
  onAuthenticationFailed?: (reason: string) => void;
}

export const createCollabProvider = (
  roomId: string,
  options?: CollabProviderOptions,
) => {
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
      options?.onAuthenticationFailed?.(String(reason ?? 'Authorization failed'));
      console.error('[Hocuspocus] authentication failed', { documentName, reason });
    },
  });

  return { doc, provider, documentName, roomId: normalizedRoomId };
};
