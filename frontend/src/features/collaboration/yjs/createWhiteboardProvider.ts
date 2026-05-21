import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { store } from '../../../store';

interface WhiteboardProviderOptions {
  onAuthenticationFailed?: (reason: string) => void;
}

export const createWhiteboardProvider = (
  roomId: string,
  options?: WhiteboardProviderOptions,
) => {
  const doc = new Y.Doc();

  const url = import.meta.env.VITE_HOCUSPOCUS_URL || 'ws://localhost:1234';
  const normalizedRoomId = roomId.trim();
  const documentName = `room-${normalizedRoomId}-whiteboard`;

  const provider = new HocuspocusProvider({
    url,
    name: documentName,
    document: doc,
    token: () => store.getState().auth.accessToken || '',
    onAuthenticationFailed: ({ reason }) => {
      options?.onAuthenticationFailed?.(String(reason ?? 'Authorization failed'));
      console.error('[Hocuspocus:Whiteboard] authentication failed', {
        documentName,
        reason,
      });
    },
  });

  return { doc, provider, documentName };
};
