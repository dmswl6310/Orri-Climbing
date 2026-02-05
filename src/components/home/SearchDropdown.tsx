"use client";

import { SearchGymSummary } from "@/services/gymService";

interface Props {
  suggestions: SearchGymSummary[];
  onSelect: (id: string) => void;
}

const SearchDropdown = ({ suggestions, onSelect }: Props) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-[110%] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
      {suggestions.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-bold text-sm">{item.name}</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5">
            {item.district} · {item.address}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SearchDropdown;
