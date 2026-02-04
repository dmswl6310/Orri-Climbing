interface KakaoRegionDocument {
  region_type: "H" | "B"; // 행정동 또는 법정동
  address_name: string; // 전체 주소 명칭
  region_1depth_name: string; // 시도 단위
  region_2depth_name: string; // 구군 단위
  region_3depth_name: string; // 동면읍 단위
  region_4depth_name: string; // 리 단위 (보통 빈 값)
  code: string; // 행정구역 코드
  x: number; // 경도
  y: number; // 위도
}

// interface KakaoRegionResponse {
//   meta: {
//     total_count: number;
//   };
//   documents: KakaoRegionDocument[];
// }
