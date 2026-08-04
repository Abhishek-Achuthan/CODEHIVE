import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { createWhiteboardProvider } from '../../collaboration/yjs/createWhiteboardProvider';
import type { WhiteboardElement, WhiteboardTool } from '../types/whiteboard';

export const useWhiteboard = (roomId: string, userInfo: { userId: string; userName: string }) => {
  const collabRef = useRef<ReturnType<typeof createWhiteboardProvider> | null>(null);
  const undoManagerRef = useRef<Y.UndoManager | null>(null);
  
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const collab = createWhiteboardProvider(roomId);
    collabRef.current = collab;
    
    const elements = collab.doc.getArray<WhiteboardElement>('elements');
    undoManagerRef.current = new Y.UndoManager(elements);
    
    // Initialize Awareness (Presence)
    const userColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    collab.provider.awareness?.setLocalStateField('user', {
      userId: userInfo.userId,
      userName: userInfo.userName,
      userColor,
    });

    const observer = () => {
      setVersion(v => v + 1);
    };
    
    elements.observe(observer);
    
    return () => {
      elements.unobserve(observer);
      collab.provider.disconnect();
      collab.doc.destroy();
    };
  }, [roomId, userInfo.userId, userInfo.userName]);

  const getElements = useCallback(() => {
    if (!collabRef.current) return [];
    return collabRef.current.doc.getArray<WhiteboardElement>('elements').toArray();
  }, []);

  const addElement = useCallback((element: WhiteboardElement) => {
    if (!collabRef.current) return;
    const elements = collabRef.current.doc.getArray<WhiteboardElement>('elements');
    elements.push([element]);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    if (!collabRef.current) return;
    const elements = collabRef.current.doc.getArray<WhiteboardElement>('elements');
    
    //y-map 
    const index = elements.toArray().findIndex(el => el.id === id);
    if (index !== -1) {
      const current = elements.get(index);
      elements.delete(index, 1);
      elements.insert(index, [{ ...current, ...updates } as WhiteboardElement]);
    }
  }, []);

  const clearBoard = useCallback(() => {
    if (!collabRef.current) return;
    const elements = collabRef.current.doc.getArray<WhiteboardElement>('elements');
    elements.delete(0, elements.length);
  }, []);

  const removeElement = useCallback((id: string) => {
    if (!collabRef.current) return;
    const elements = collabRef.current.doc.getArray<WhiteboardElement>('elements');
    const index = elements.toArray().findIndex(el => el.id === id);
    if (index !== -1) {
      elements.delete(index, 1);
    }
  }, []);

  const updateCursor = useCallback((x: number, y: number, tool: WhiteboardTool) => {
    if (!collabRef.current) return;
    collabRef.current.provider.awareness?.setLocalStateField('cursor', {
      x,
      y,
      tool,
    });
  }, []);

  return {
    elements: getElements(),
    addElement,
    updateElement,
    removeElement,
    clearBoard,
    updateCursor,
    undo: () => undoManagerRef.current?.undo(),
    redo: () => undoManagerRef.current?.redo(),
    awareness: collabRef.current?.provider.awareness,
    version
  };
};
