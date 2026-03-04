import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLocationSearch() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("내 위치로 검색");

  // gps 검색
  const handleLocationSearch = () => {
    if (isLoading) return;
    if (!navigator.geolocation)
      return alert("GPS를 지원하지 않는 브라우저입니다."); // http일때 사용불가함

    setIsLoading(true);
    setUserLocation("위치 파악 중...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation("주변 암장 찾는 중...");

        router.push(`/search?lat=${latitude}&lon=${longitude}`);
        setIsLoading(false);
      },
      (err) => {
        console.error("GPS Error: ", err);
        alert("위치 정보를 가져오는데 실패했습니다. GPS 권한을 확인해주세요.");
        setIsLoading(false);
        setUserLocation("내 위치로 검색");
      },
      {
        enableHighAccuracy: true, // 주변 wifi신호나 gps장치를 모두 모아서 정확성 개선
        timeout: 5000, // 5초이내 미응답시 에러발생
        maximumAge: 0, // 항상 새로운 위치 요청(캐시 미사용)
      },
    );
  };

  return { isLoading, userLocation, handleLocationSearch };
}
