"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  // 현재 활성화된 정렬 탭 확인 (URL에 없으면 기본값 설정)
  const activeSort =
    searchParams.get("sort") || (lat && lon ? "distance" : "popular");

  const handleSort = (sortType: string) => {
    // 1. 기존 URL 파라미터를 복사해서 조작할 준비
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortType);

    // 2. 만약 '거리순'을 눌렀는데 내 위치(lat, lon)가 모른다면? -> GPS 가동!
    if (sortType === "distance" && (!lat || !lon)) {
      if (!navigator.geolocation) return alert("GPS를 지원하지 않습니다.");

      setIsGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          params.set("lat", pos.coords.latitude.toString());
          params.set("lon", pos.coords.longitude.toString());
          router.push(`/search?${params.toString()}`);
          setIsGpsLoading(false);
        },
        () => {
          alert("위치 정보를 가져올 수 없어 거리순 정렬이 불가합니다.");
          setIsGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
      return; // GPS 응답을 기다려야 하므로 여기서 함수 종료
    }

    // 3. 거리순이 아니거나, 이미 위치를 알고 있다면 바로 URL 이동!
    router.push(`/search?${params.toString()}`);
  };

  // 탭 스타일을 결정하는 유틸 함수
  const getTabStyle = (sortType: string) => {
    const isActive = activeSort === sortType;
    return `px-4 py-2 rounded-full text-sm font-bold transition-all ${
      isActive
        ? "bg-slate-900 text-white shadow-md"
        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
    }`;
  };

  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => handleSort("distance")}
        className={getTabStyle("distance")}
        disabled={isGpsLoading}
      >
        {isGpsLoading ? "📍 위치 찾는 중..." : "📍 거리순"}
      </button>
      <button
        onClick={() => handleSort("popular")}
        className={getTabStyle("popular")}
      >
        🔥 인기순
      </button>
      <button
        onClick={() => handleSort("newest")}
        className={getTabStyle("newest")}
      >
        ✨ 최신순
      </button>
    </div>
  );
}
