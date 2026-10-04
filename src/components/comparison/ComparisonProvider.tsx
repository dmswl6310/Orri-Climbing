"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { createComparisonStore } from "@/utils/comparison";

type Candidate = { id: string; name: string };
const Context = createContext<{ store: ReturnType<typeof createComparisonStore>; candidates: Candidate[] } | null>(null);

export default function ComparisonProvider({ candidates, children }: { candidates: Candidate[]; children: React.ReactNode }) {
  const [store] = useState(() => createComparisonStore(candidates.map(({ id }) => id), () => window.sessionStorage));
  return <Context.Provider value={{ store, candidates }}>{children}</Context.Provider>;
}
export function useComparison() {
  const context = useContext(Context);
  if (!context) throw new Error("ComparisonProvider is required");
  const selection = useSyncExternalStore(context.store.subscribe, context.store.getSnapshot, context.store.getServerSnapshot);
  return { ...context, ...selection };
}
