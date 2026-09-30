"use client";

import { useId } from "react";
import { useSearchAutocomplete } from "@/hooks/useSearchAutocomplete";
import { cancelLocationSearch } from "@/hooks/useLocationSearch";
import type { SearchGymSummary } from "@/types/gyms/types";
import { useRouter } from "next/navigation";
import RefreshIcon from "../icons/RefreshIcon";
import GpsIcon from "../icons/GpsIcon";
import SearchDropdown from "./SearchDropdown";

interface SearchInputBoxProps {
  gymSearchPool: SearchGymSummary[];
  query: string;
  isFloat: boolean;
  isLoading: boolean;
  onLocationSearch: () => void;
}

export default function SearchInputBox(props: SearchInputBoxProps) {
  // Back/forward navigation resets the input and any highlighted suggestion.
  return <SearchInput key={props.query} {...props} />;
}

function SearchInput({ gymSearchPool, query, isFloat, isLoading, onLocationSearch }: SearchInputBoxProps) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-suggestions`;
  const { inputText, setInputText, isDropdownOpen, setIsDropdownOpen,
    activeIndex, setActiveIndex, searchRef, suggestions } = useSearchAutocomplete(gymSearchPool, query);
  const expanded = isDropdownOpen && suggestions.length > 0;
  const close = () => { setIsDropdownOpen(false); setActiveIndex(-1); };
  const select = (gymId: string) => { cancelLocationSearch(); close(); router.push(`/gyms/${gymId}`); };
  const search = () => {
    const keyword = inputText.trim();
    if (!keyword) return;
    cancelLocationSearch();
    close();
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className={`flex ${isFloat ? "flex-row items-center gap-2" : "flex-col sm:flex-row gap-3"}`}>
      <div ref={searchRef}
        className={`${isFloat ? "flex-1 py-2" : "flex-[3] py-3"} min-w-0 relative bg-white rounded-xl shadow-lg shadow-black/5 flex items-center px-3 md:px-5 border border-gray-200 focus-within:border-blue-500`}>
        {isFloat && (
          <button type="button" onClick={onLocationSearch} disabled={isLoading}
            aria-label="내 위치로 검색" className="mr-2 p-1 text-gray-600 disabled:opacity-50">
            {isLoading ? <RefreshIcon className="animate-spin w-4 h-4" /> : <GpsIcon className="w-4 h-4" />}
          </button>
        )}
        <span aria-hidden="true" className="text-gray-500 mr-2">🔍</span>
        <label htmlFor={id} className="sr-only">지역 또는 암장 이름 검색</label>
        <input id={id} type="search" role="combobox" autoComplete="off"
          aria-autocomplete="list" aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={expanded && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          value={inputText} onFocus={() => setIsDropdownOpen(true)} onBlur={close}
          onChange={(event) => {
            setInputText(event.target.value);
            setActiveIndex(-1);
            setIsDropdownOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            if (event.key === "Escape") { event.preventDefault(); close(); }
            else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length) {
              event.preventDefault();
              setIsDropdownOpen(true);
              setActiveIndex((current) => {
                if (!expanded || current < 0) return event.key === "ArrowDown" ? 0 : suggestions.length - 1;
                return (current + (event.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length;
              });
            } else if (event.key === "Enter") {
              event.preventDefault();
              if (expanded && activeIndex >= 0 && suggestions[activeIndex]) select(suggestions[activeIndex].id);
              else search();
            }
          }}
          placeholder="지역 또는 암장 이름 검색"
          className="w-full min-w-0 outline-none text-sm md:text-base font-medium bg-transparent" />
        {expanded && <SearchDropdown suggestions={suggestions} onSelect={select} listId={listId}
          activeIndex={activeIndex} onHighlight={setActiveIndex} />}
      </div>
      <button type="button" onClick={search}
        className={`bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 ${isFloat ? "px-4 py-2 whitespace-nowrap" : "flex-1 px-8 py-3 shadow-md"}`}>
        검색{isFloat ? "" : "하기"}
      </button>
    </div>
  );
}
