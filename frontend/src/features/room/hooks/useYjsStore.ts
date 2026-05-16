import {
  type TLRecord,
  type TLStore,
  createTLStore,
  defaultShapeUtils,
} from "tldraw";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import type { HocuspocusProvider } from "@hocuspocus/provider";

type StoreChangeEvent = {
  changes: {
    added: Record<string, TLRecord>;
    updated: Record<string, [from: TLRecord, to: TLRecord]>;
    removed: Record<string, TLRecord>;
  };
  source: "remote" | "unknown" | "user";
};

export function useYjsStore({
  doc,
  provider,
}: {
  roomId: string;
  doc: Y.Doc;
  provider: HocuspocusProvider | null | undefined;
}) {
  const [store] = useState(() =>
    createTLStore({ shapeUtils: defaultShapeUtils })
  );

  const [loadingState, setLoadingState] = useState<
    | { status: "loading" }
    | { status: "ready"; store: TLStore }
    | { status: "error"; error: string }
  >({ status: "loading" });

  useEffect(() => {
    if (!doc || !provider) return;

    setLoadingState({ status: "loading" });

    const unsubs: (() => void)[] = [];
    const yRecords = doc.getMap<TLRecord>("records");

    const handleStoreChange = ({ changes, source }: StoreChangeEvent) => {
      if (source !== "user") return;

      doc.transact(() => {
        for (const record of Object.values(changes.added)) {
          if (record.typeName === "instance_presence") continue;
          yRecords.set(record.id, record);
        }

        for (const [, to] of Object.values(changes.updated)) {
          if (to.typeName === "instance_presence") continue;
          yRecords.set(to.id, to);
        }

        for (const id of Object.keys(changes.removed)) {
          yRecords.delete(id);
        }
      }, store); 
    };

    const handleYjsChange = (
      event: Y.YMapEvent<TLRecord>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin === store) return;

      store.mergeRemoteChanges(() => {
        event.changes.keys.forEach((change, id) => {
          if (change.action === "add" || change.action === "update") {
            const record = yRecords.get(id);
            if (record) store.put([record]);
          } else if (change.action === "delete") {
            store.remove([id as TLRecord["id"]]);
          }
        });
      });
    };

    const initialRecords = Array.from(yRecords.values());

    if (initialRecords.length > 0) {
      store.mergeRemoteChanges(() => {
        store.put(initialRecords);
      });
    } else {
      doc.transact(() => {
        for (const record of store.allRecords()) {
          if (record.typeName === "instance_presence") continue;
          yRecords.set(record.id, record);
        }
      }, store);
    }

    yRecords.observe(handleYjsChange);
    unsubs.push(() => yRecords.unobserve(handleYjsChange));

    unsubs.push(
      store.listen(handleStoreChange as any, {
        scope: "document",
        source: "user",
      })
    );

    setLoadingState({ status: "ready", store });

    return () => unsubs.forEach((fn) => fn());
  }, [doc, store, provider]);

  return loadingState;
}