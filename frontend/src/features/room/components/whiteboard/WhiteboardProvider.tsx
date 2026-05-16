import React, { createContext, useContext, useEffect, useState,type ReactNode } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { createWhiteboardProvider } from '../../../collaboration/yjs/createWhiteboardProvider';

interface WhiteboardContextType {
  provider: HocuspocusProvider | null;
  doc: Y.Doc | null;
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined);

export const WhiteboardProvider: React.FC<{ roomId: string; children: ReactNode }> = ({ roomId, children }) => {
  const [collab, setCollab] = useState<ReturnType<typeof createWhiteboardProvider> | null>(null);

  useEffect(() => {
    const instance = createWhiteboardProvider(roomId);
    setCollab(instance);

    return () => {
      instance.provider.disconnect();
      instance.doc.destroy();
    };
  }, [roomId]);

  return (
    <WhiteboardContext.Provider value={{ 
      provider: collab?.provider ?? null, 
      doc: collab?.doc ?? null 
    }}>
      {children}
    </WhiteboardContext.Provider>
  );
};

export const useWhiteboardContext = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboardContext must be used within a WhiteboardProvider');
  }
  return context;
};
