export type SearchGymSummary = Pick<GymDetail, "id" | "name" | "district" | "address">;
export type GymCardData = Pick<GymDetail, "id" | "name" | "thumbnail" | "district" | "tags" | "facilities" | "prices" | "amenities" | "beginnerLesson" | "isDemo">;

export interface GymPrice {
  kind?: "day-pass" | "other";
  label: string;
  amount: number;
}

export interface OperatingHour {
  day: string; // "평일", "주말", "공휴일" 등
  time: string; // "10:00 - 23:00" 등
  isClosed: boolean; // 휴무 여부
}

export interface DifficultySystem {
  type: "color" | "v-scale"; // 색상 기준 혹은 V-레벨 기준
  levels: string[]; // ["빨강", "주황", ...] 또는 ["V0", "V1", ...]
}

export interface GymDetail {
  id: string;
  name: string;
  thumbnail: string;
  district: string; // "강남구", "마포구" 등
  address: string; // 전체 주소
  lat: number; // 위도
  lon: number; // 경도
  scrapCount: number; // 스크랩(저장) 수
  rating: number; // 별점 (0.0 ~ 5.0)
  tags: string[];

  description: string;
  images: string[]; // 상세 이미지 URL 배열
  hours: OperatingHour[];
  contact: string; // 전화번호
  facilities: string[]; // ["샤워실", "주차가능", ...]
  difficultySystem: DifficultySystem;
  prices?: GymPrice[];
  amenities?: Partial<Record<"parking" | "shower" | "rental", boolean>>;
  beginnerLesson?: boolean;
  isDemo?: boolean;
}

export type GymSummary = Pick<
  GymDetail,
  "id" | "name" | "thumbnail" | "district" | "scrapCount"
>;
