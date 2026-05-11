import * as Y from 'yjs';

export interface YjsEditorDoc {
  doc: Y.Doc;
  code: Y.Text;
  metadata: Y.Map<string>;
}

export const createYjsDoc = (): YjsEditorDoc => {
  const doc = new Y.Doc();

  const code = doc.getText('editor');
  const metadata = doc.getMap<string>('metadata');

  return {
    doc,
    code,
    metadata,
  };
};