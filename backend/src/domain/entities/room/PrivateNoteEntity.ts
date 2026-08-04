import { NoteContent } from '../../types/NoteContent';

export interface PrivateNoteEntity {
  id?: string ;
  roomId: string;
  userId: string;
  content: NoteContent;
  createdAt: Date;
  updatedAt: Date;
}