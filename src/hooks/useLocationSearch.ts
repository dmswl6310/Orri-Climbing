import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { validCoordinates } from "@/utils/search";

// Browser geolocation has no abort API. Invalidate callbacks whenever a newer
// search/sort supersedes the request, including requests from another control.
let cancelActiveRequest: (() => void) | undefined;
export function cancelLocationSearch() {
  cancelActiveRequest?.();
}

export function useLocationSearch(query = "") {
  const router = useRouter();
  const [locating, setLocating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const cancelOwnRequest = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const handleBack = () => cancelOwnRequest.current?.();
    const handleLinkNavigation = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (link && link.origin === window.location.origin && (!link.target || link.target === "_self") && !link.hasAttribute("download")) {
        cancelOwnRequest.current?.();
      }
    };
    window.addEventListener("popstate", handleBack);
    document.addEventListener("click", handleLinkNavigation, true);
    return () => {
      cancelOwnRequest.current?.();
      window.removeEventListener("popstate", handleBack);
      document.removeEventListener("click", handleLinkNavigation, true);
    };
  }, [query]);

  const handleLocationSearch = () => {
    if (cancelOwnRequest.current || isPending) return;
    cancelLocationSearch();
    setError("");
    if (!navigator.geolocation) {
      setError("위치 검색을 지원하지 않는 브라우저입니다. 지역명으로 검색해주세요.");
      return;
    }
    let active = true;
    const finish = () => {
      active = false;
      cancelOwnRequest.current = undefined;
      if (cancelActiveRequest === finish) cancelActiveRequest = undefined;
      setLocating(false);
    };
    cancelOwnRequest.current = finish;
    cancelActiveRequest = finish;
    setLocating(true);
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!active) return;
          finish();
          const { latitude, longitude } = position.coords;
          if (!validCoordinates(latitude, longitude)) {
            setError("올바른 위치를 받지 못했습니다. 다시 시도하거나 지역명으로 검색해주세요.");
            return;
          }
          const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude), sort: "distance" });
          if (query.trim()) params.set("q", query.trim());
          startTransition(() => router.push(`/search?${params}`));
        },
        (failure) => {
          if (!active) return;
          finish();
          setError(failure.code === 1
            ? "위치 권한이 거부되었습니다. 브라우저에서 권한을 허용하거나 지역명으로 검색해주세요."
            : failure.code === 3
              ? "위치 확인 시간이 초과되었습니다. 다시 시도하거나 지역명으로 검색해주세요."
              : "위치를 확인할 수 없습니다. 다시 시도하거나 지역명으로 검색해주세요.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
      );
    } catch {
      if (!active) return;
      finish();
      setError("위치를 요청할 수 없습니다. 지역명으로 검색해주세요.");
    }
  };

  return {
    isLoading: locating || isPending,
    userLocation: locating ? "위치 파악 중..." : isPending ? "주변 암장 찾는 중..." : "내 위치로 검색",
    error, handleLocationSearch,
  };
}
