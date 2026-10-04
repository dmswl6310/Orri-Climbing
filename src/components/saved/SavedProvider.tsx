"use client";
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { createSavedStore, SAVED_KEY } from "@/utils/saved";

const Context = createContext<ReturnType<typeof createSavedStore> | null>(null);
export default function SavedProvider({ ids, children }: { ids: string[]; children: React.ReactNode }) {
  const [store] = useState(() => createSavedStore(ids, () => window.localStorage));
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      try {
        if (event.storageArea === window.localStorage && (event.key === SAVED_KEY || event.key === null)) store.refresh();
      } catch { store.refresh(); }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useSaved() {
  const store = useContext(Context);
  if (!store) throw new Error("SavedProvider is required");
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...snapshot, store };
}
