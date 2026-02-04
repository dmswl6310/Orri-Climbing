// 요일별 운영 시간 타입
export interface OperatingHour {
  day: string; // "평일", "주말", "공휴일" 등
  time: string; // "10:00 - 23:00" 등
  isClosed: boolean; // 휴무 여부
}

// 난이도 체계 타입
export interface DifficultySystem {
  type: "color" | "v-scale"; // 색상 기준 혹은 V-레벨 기준
  levels: string[]; // ["빨강", "주황", ...] 또는 ["V0", "V1", ...]
}

// 전체 암장 상세 데이터 타입 (Summary 정보 포함)
export interface GymDetail {
  // --- 요약 정보 (Summary) ---
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

  // --- 상세 정보 (Detail) ---
  description: string;
  images: string[]; // 상세 이미지 URL 배열
  hours: OperatingHour[];
  contact: string; // 전화번호
  facilities: string[]; // ["샤워실", "주차가능", ...]
  difficultySystem: DifficultySystem;
}

// GymDetail에서 일부만 골라서 GymSummary 타입을 만듦
export type GymSummary = Pick<
  GymDetail,
  "id" | "name" | "thumbnail" | "district" | "scrapCount"
>;

// // import type { Session } from "next-auth";

// // 데이터 타입 정의
// export type BaseGymData = {
//   name: string;
//   address: GymAddress;
//   coordinates: MapCoordinates;
//   contact: string;
// };

// export type GymAddress = {
//   jibunAddress: string;
//   roadAddress: string;
//   unitAddress: string;
// };

// // /gyms로 받는 썸네일 데이터
// export type SimpleGymData = {
//   id: number;
//   name: string;
//   address: GymAddress;
//   latestSettingDay?: string;
//   likeNumber?: string;
// };

// export type GymData = BaseGymData & {
//   id: string;
//   latestSettingDay: string | null;
//   sns: SnsList | null;
//   homepage: string | null;
//   images: string[] | null;
//   defaultImage: string | null;
//   openHours: OpenHours[] | null;
//   pricing: Pricing[] | null;
//   tags: string[] | null;
//   description: string | null;
//   grades: string[] | null;
//   accommodations: string[] | null;
//   comments: UserComment[] | null;
//   likeNumber: number | null;
// };

// export type GymDataObject = {
//   [key: string]:
//     | string
//     | string[]
//     | SnsList
//     | OpenHours[]
//     | Pricing[]
//     | UserComment[]
//     | number
//     | MapCoordinates
//     | GymAddress;
// };

// export type MapCoordinates = {
//   latitude: number;
//   longitude: number;
// };

// export type OpenHours = {
//   days: string;
//   openTime: string;
//   closeTime: string;
// };

// export type Pricing = {
//   item: string;
//   price: string;
// };

// export type SnsList = {
//   twitter?: string;
//   facebook?: string;
//   instagram?: string;
// };

// export type UserComment = { user: string; createdAt: string; text: string };

// //컴포넌트 props 타입 정의
// export interface CommentsProps {
//   id: string;
//   comments: UserComment[] | null;
//   // session: Session | null;
// }

// export interface CommentTextareaProps {
//   handleAddComment: (input: string) => Promise<string>;
// }

// export interface ContactInfoProps {
//   contact: string;
//   snsList: SnsList | null;
// }

// export interface GradeBarProps {
//   grades: string[] | null;
// }

// export interface ImageCarouselProps {
//   defaultImage: string | null;
//   imageList: string[] | null;
// }

// export interface MapProps {
//   name: string;
//   coordinates: MapCoordinates;
// }

// export interface OpenHoursTableProps {
//   openHours: Array<OpenHours> | null;
// }

// export interface PricingTableProps {
//   pricing: Array<Pricing> | null;
// }

// export interface TagListProps {
//   tags: string[] | null;
// }

// export interface TagProps {
//   prefix?: string;
//   text: string;
// }
