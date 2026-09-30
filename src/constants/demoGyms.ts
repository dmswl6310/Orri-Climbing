import type { GymDetail } from "@/types/gyms/types";

// Fictional examples exclusively for trying budget, lesson and comparison flows.
// These are not prices, amenities or locations of an operating business.
export const DEMO_GYMS: GymDetail[] = [
  {
    id: "demo-1", name: "오르리 데모 강남", isDemo: true,
    thumbnail: "", district: "강남구", address: "서울 강남구 · 가상 암장",
    lat: 37.499, lon: 127.03, scrapCount: 0, rating: 0,
    tags: ["가상데모", "체험강습"], description: "필터와 비교 기능을 체험하기 위한 가상 암장입니다. 실제 영업 정보가 아닙니다.",
    images: [], hours: [{ day: "평일", time: "10:00 - 22:00", isClosed: false }, { day: "주말", time: "10:00 - 20:00", isClosed: false }],
    contact: "", facilities: ["주차가능", "샤워실", "암벽화대여"],
    amenities: { parking: true, shower: true, rental: true }, beginnerLesson: true,
    difficultySystem: { type: "v-scale", levels: ["V0", "V1", "V2", "V3"] },
    prices: [{ kind: "day-pass", label: "일일 이용권", amount: 12000 }],
  },
  {
    id: "demo-2", name: "오르리 데모 성수", isDemo: true,
    thumbnail: "", district: "성동구", address: "서울 성동구 · 가상 암장",
    lat: 37.545, lon: 127.055, scrapCount: 0, rating: 0,
    tags: ["가상데모"], description: "가격 경계와 편의 시설을 비교하기 위한 가상 암장입니다. 실제 영업 정보가 아닙니다.",
    images: [], hours: [{ day: "평일", time: "12:00 - 23:00", isClosed: false }, { day: "일요일", time: "", isClosed: true }],
    contact: "", facilities: ["암벽화대여"],
    amenities: { parking: false, shower: false, rental: true }, beginnerLesson: false,
    difficultySystem: { type: "color", levels: ["흰색", "노랑", "파랑"] },
    prices: [{ kind: "day-pass", label: "일일 이용권", amount: 20000 }],
  },
  {
    id: "demo-3", name: "오르리 데모 홍대", isDemo: true,
    thumbnail: "", district: "마포구", address: "서울 마포구 · 가상 암장",
    lat: 37.556, lon: 126.924, scrapCount: 0, rating: 0,
    tags: ["가상데모", "체험강습"], description: "일부 정보가 없는 경우를 체험하는 가상 암장입니다. 실제 영업 정보가 아닙니다.",
    images: [], hours: [], contact: "", facilities: ["주차가능", "샤워실"],
    amenities: { parking: true, shower: true }, beginnerLesson: true,
    difficultySystem: { type: "v-scale", levels: ["V0", "V1", "V2", "V3", "V4"] },
    prices: [{ kind: "day-pass", label: "일일 이용권", amount: 25000 }],
  },
];
