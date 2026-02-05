"use client";

import GpsIcon from "../icons/GpsIcon";
import RefreshIcon from "../icons/RefreshIcon";

interface Props {
  userLocation: string;
  isLoading: boolean;
  onLocationSearch: () => void;
}

const LocationFinder = ({
  userLocation,
  isLoading,
  onLocationSearch,
}: Props) => (
  <div className="flex justify-between items-end px-1 mb-2.5">
    <button
      onClick={onLocationSearch}
      className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
    >
      <GpsIcon className="w-4 h-4" />
      <span className="truncate max-w-[150px]">{userLocation}</span>
    </button>
    <button onClick={onLocationSearch} className="p-1 group">
      <RefreshIcon
        className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-all ${
          isLoading ? "animate-spin" : ""
        }`}
      />
    </button>
  </div>
);

export default LocationFinder;
