import type { GymDetail } from "@/types/gyms/types";
import type { Facility } from "./search";

const facilityAliases: Record<Facility, string[]> = {
  parking: ["주차가능", "무료주차", "유료주차", "주차", "주차협소"],
  shower: ["샤워실", "샤워가능", "단독샤워룸", "깔끔한샤워실", "단독샤워"],
  rental: ["암벽화대여", "암벽화 대여", "신발대여"],
};

export function getFacilityStatus(gym: Pick<GymDetail, "facilities" | "amenities">, key: Facility): boolean | undefined {
  if (typeof gym.amenities?.[key] === "boolean") return gym.amenities[key];
  return gym.facilities.some((name) => facilityAliases[key].includes(name)) ? true : undefined;
}

export function getDailyPrice(gym: Pick<GymDetail, "prices">): number | undefined {
  const prices = gym.prices?.filter((price) =>
    (price.kind === "day-pass" || (!price.kind && price.label === "일일 이용권")) &&
    Number.isFinite(price.amount) && price.amount >= 0,
  ).map((price) => price.amount);
  return prices?.length ? Math.min(...prices) : undefined;
}

export const availabilityLabel = (value: boolean | undefined) =>
  value === true ? "가능" : value === false ? "불가" : "정보 없음";

export function formatDistance(distance: number | undefined) {
  if (distance === undefined || !Number.isFinite(distance)) return "위치 미설정";
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
}
