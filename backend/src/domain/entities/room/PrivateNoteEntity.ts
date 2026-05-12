import { NoteContent } from '../../types/NoteContent';

export interface PrivateNoteEntity {
  id?: string | undefined;
  roomId: string;
  userId: string;
  content: NoteContent;
  createdAt: Date;
  updatedAt: Date;
}