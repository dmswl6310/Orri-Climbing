import { POPULAR_GYMS } from "@/constants/gyms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 스크랩수(scrapCount)가 높은 순으로 정렬해 상위 3개 반환
    const sortedGyms = [...POPULAR_GYMS]
      .sort((a, b) => b.scrapCount - a.scrapCount)
      .slice(0, 3);

    return NextResponse.json(sortedGyms);
  } catch (error) {
    console.error("인기 암장 API 에러:", error);
    return NextResponse.json(
      { error: "데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
