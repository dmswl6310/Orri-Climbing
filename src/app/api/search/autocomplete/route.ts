import { NextResponse } from "next/server";
import { POPULAR_GYMS } from "@/constants/gyms"; // 전체 암장 목데이터

export async function GET(request: Request) {
  try {
    const results = POPULAR_GYMS;
    return NextResponse.json(results);
  } catch (error) {
    console.error("자동완성 API 에러:", error);
    return NextResponse.json([], { status: 500 });
  }
}
