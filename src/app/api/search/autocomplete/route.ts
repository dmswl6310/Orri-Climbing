import { MOCK_GYMS } from "@/constants/gyms";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const results = MOCK_GYMS;
    return NextResponse.json(results);
  } catch (error) {
    console.error("자동완성 API 에러:", error);
    return NextResponse.json([], { status: 500 });
  }
}
