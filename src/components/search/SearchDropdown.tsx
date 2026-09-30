import type { SearchGymSummary } from "@/types/gyms/types";

interface SearchDropdownProps {
  suggestions: SearchGymSummary[];
  onSelect: (id: string) => void;
  listId: string;
  activeIndex: number;
  onHighlight: (index: number) => void;
}

export default function SearchDropdown({ suggestions, onSelect, listId, activeIndex, onHighlight }: SearchDropdownProps) {
  return (
    <ul id={listId} role="listbox" aria-label="암장 추천"
      className="absolute top-[110%] left-0 w-full max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
      {suggestions.map((item, index) => (
        <li key={item.id} id={`${listId}-${index}`} role="option" aria-selected={activeIndex === index}
          ref={(element) => { if (activeIndex === index) element?.scrollIntoView?.({ block: "nearest" }); }}
          onMouseDown={(event) => event.preventDefault()}
          onMouseEnter={() => onHighlight(index)}
          onClick={() => onSelect(item.id)}
          className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 flex flex-col ${activeIndex === index ? "bg-blue-50" : "hover:bg-blue-50"}`}>
          <span className="text-blue-700 font-bold text-sm">{item.name}</span>
          <span className="text-xs text-gray-600 mt-1">{item.district} · {item.address}</span>
        </li>
      ))}
    </ul>
  );
}
