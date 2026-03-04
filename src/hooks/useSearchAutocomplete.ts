import { SearchGymSummary } from "@/services/gymService";
import { useEffect, useMemo, useRef, useState } from "react";

export function useSearchAutocomplete(
  gymSearchPool: SearchGymSummary[],
  query: string,
) {
  const [inputText, setInputText] = useState(query);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // searchRef 영역(검색창+드롭다운) 밖을 클릭했다면 드롭다운 닫기
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setInputText(query);
  }, [query]);

  // 자동완성 리스트
  const suggestions = useMemo(() => {
    const keyword = inputText.trim().toLowerCase();
    if (!keyword) return [];
    return gymSearchPool
      .filter(
        (gym: SearchGymSummary) =>
          gym.name.toLowerCase().includes(keyword) ||
          gym.district.includes(keyword) ||
          gym.address.toLowerCase().includes(keyword),
      )
      .slice(0, 8);
  }, [inputText, gymSearchPool]);

  return {
    inputText,
    setInputText,
    isDropdownOpen,
    setIsDropdownOpen,
    searchRef,
    suggestions,
  };
}
