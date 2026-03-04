// 거리 계산 함수 (하버사인 공식 - km 단위 반환)
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity; // 좌표가 없으면 맨 뒤로 밀리게 무한대 반환
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
