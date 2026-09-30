import { validCoordinates } from "@/utils/search";

// 거리 계산 함수 (하버사인 공식 - km 단위 반환)
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  if (!validCoordinates(lat1, lon1) || !validCoordinates(lat2, lon2)) return Infinity;
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const clamped = Math.min(1, Math.max(0, a));
  const c = 2 * Math.atan2(Math.sqrt(clamped), Math.sqrt(1 - clamped));
  return R * c;
}
