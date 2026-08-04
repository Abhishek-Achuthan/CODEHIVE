export type WhiteboardTool = 'pencil' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'select' | 'arrow';

export type WhiteboardElementType = 'pencil' | 'rectangle' | 'circle' | 'text' | 'arrow';

export interface BaseWhiteboardElement {
  id: string;
  type: WhiteboardElementType;
  x: number;
  y: number;
  stroke: string;
  strokeWidth: number;
  createdBy: string;
  updatedAt: number;
}

export interface PencilElement extends BaseWhiteboardElement {
  type: 'pencil';
  points: number[]; 
}

export interface RectangleElement extends BaseWhiteboardElement {
  type: 'rectangle';
  width: number;
  height: number;
  fill: string;
}

export interface CircleElement extends BaseWhiteboardElement {
  type: 'circle';
  radius: number;
  fill: string;
}

export interface TextElement extends BaseWhiteboardElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
}

export interface ArrowElement extends BaseWhiteboardElement {
  type: 'arrow';
  points: number[]; 
}

export type WhiteboardElement = 
  | PencilElement 
  | RectangleElement 
  | CircleElement 
  | TextElement
  | ArrowElement;

export interface PresenceState {
  userId: string;
  userName: string;
  userColor: string;
  cursorX?: number;
  cursorY?: number;
  activeTool?: WhiteboardTool;
}
