import type { SearchGymSummary } from "@/types/gyms/types";
import { useEffect, useMemo, useRef, useState } from "react";

export function useSearchAutocomplete(gymSearchPool: SearchGymSummary[], query: string) {
  const [inputText, setInputText] = useState(query);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: PointerEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  const suggestions = useMemo(() => {
    const keyword = inputText.trim().toLowerCase();
    return keyword ? gymSearchPool.filter((gym) =>
      [gym.name, gym.district, gym.address].some((text) => text.toLowerCase().includes(keyword)),
    ).slice(0, 8) : [];
  }, [inputText, gymSearchPool]);

  return { inputText, setInputText, isDropdownOpen, setIsDropdownOpen,
    activeIndex, setActiveIndex, searchRef, suggestions };
}
